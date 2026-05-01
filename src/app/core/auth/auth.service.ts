import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/auth.model';
import { Injectable, inject, PLATFORM_ID, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private tokenSubject = new BehaviorSubject<string | null>(this.getInitialToken());
  token$ = this.tokenSubject.asObservable();

  // 1. Kullanıcının giriş yapıp yapmadığını tutan Signal
  isLoggedIn = toSignal(
    this.token$.pipe(map(token => !!token)),
    { initialValue: !!this.getInitialToken() }
  );

  // 2. Kullanıcının rolünü anlık dinleyen Signal
  userRole = toSignal(
    this.token$.pipe(map(() => this.getRole())),
    { initialValue: this.getRole() }
  );

  // 3. Sepet ikonunun gösterilip gösterilmeyeceğine karar veren Computed Signal
  showCartIcon = computed(() => {
    // Hiç giriş yapılmamışsa sepeti göster (Tıklayınca logine atma mantığın için)
    if (!this.isLoggedIn()) {
      return true;
    }

    const role = this.userRole();
    if (!role) return true;

    // Spring Boot'tan gelen rol string ('ROLE_SELLER') veya array ([{authority: 'ROLE_SELLER'}]) olabilir
    const roleString = typeof role === 'string' ? role.toUpperCase() : JSON.stringify(role).toUpperCase();

    // Eğer rol Seller veya Admin içeriyorsa sepeti GİZLE
    const isSellerOrAdmin = roleString.includes('SELLER') || roleString.includes('ADMIN');

    // Satıcı veya Admin DEĞİLSE (yani User ise) göster
    return !isSellerOrAdmin;
  });

  isSeller = computed(() => {
    const role = this.userRole();
    if (!role) return false;
    const roleString = typeof role === 'string' ? role.toUpperCase() : JSON.stringify(role).toUpperCase();
    return roleString.includes('SELLER');
  });

  isAdmin = computed(() => {
    const role = this.userRole();
    if (!role) return false;
    const roleString = typeof role === 'string' ? role.toUpperCase() : JSON.stringify(role).toUpperCase();
    return roleString.includes('ADMIN');
  });

  private getInitialToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.token);
      })
    );
  }

  registerUser(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/user`, data);
  }

  registerSeller(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/seller`, data);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.tokenSubject.next(null);
    this.router.navigate(['/products']);
  }

  private saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
    this.tokenSubject.next(token);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  getRole(): string | null {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? (decodedToken.role || decodedToken.authorities) : null;
  }
}
