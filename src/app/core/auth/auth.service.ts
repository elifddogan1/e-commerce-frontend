import { AuthResponse, LoginRequest, RegisterRequest } from '../../shared/models/auth.model';// .model kısmını sildik, dosya adın auth.ts ise böyle kalmalı
import { Injectable, inject, PLATFORM_ID } from '@angular/core'; // PLATFORM_ID eklendi
import { isPlatformBrowser } from '@angular/common'; // isPlatformBrowser eklendi
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // PLATFORM_ID'yi inject ediyoruz
  private platformId = inject(PLATFORM_ID);

  // Başlangıçta token'ı güvenli bir şekilde alıyoruz
  private tokenSubject = new BehaviorSubject<string | null>(this.getInitialToken());
  token$ = this.tokenSubject.asObservable();

  // Sunucu tarafında patlamaması için başlangıç kontrolü
  private getInitialToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/v1/auth/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.token);
      })
    );
  }

  registerUser(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/v1/auth/register/user`, data);
  }

  registerSeller(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/v1/auth/register/seller`, data);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.tokenSubject.next(null);
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

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      // btoa/atob tarayıcı API'sidir. Node.js'de (SSR) sıkıntı çıkarabilir.
      // getToken() zaten null döneceği için sunucuda buraya girmez ama yine de güvenlidir.
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
