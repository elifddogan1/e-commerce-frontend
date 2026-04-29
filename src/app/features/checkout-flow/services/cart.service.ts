// cart.service.ts
import { Injectable, effect, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // HttpParams eklendi
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CartDTO, AddToCartRequest } from '../../../shared/models/cart.model';
import { AuthService } from '../../../core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;
  private authService = inject(AuthService);

  private cartSubject = new BehaviorSubject<CartDTO | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.loadCart();
      } else {
        this.cartSubject.next(null);
      }
    });
  }

  loadCart() {
    this.http.get<CartDTO>(this.apiUrl).subscribe({
      next: (cart) => this.cartSubject.next(cart),
      error: (err) => console.error('Sepet yüklenirken hata oluştu', err)
    });
  }

  public cartItemCount$ = this.cart$.pipe(
    map(cart => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0)
  );

  addToCart(request: AddToCartRequest): Observable<CartDTO> {
    return this.http.post<CartDTO>(`${this.apiUrl}/items`, request).pipe(
      tap(updatedCart => this.cartSubject.next(updatedCart))
    );
  }

  // Backend: DELETE /api/cart/items/{cartItemId}
  removeCartItem(cartItemId: string): Observable<CartDTO> {
    return this.http.delete<CartDTO>(`${this.apiUrl}/items/${cartItemId}`).pipe(
      tap(updatedCart => this.cartSubject.next(updatedCart))
    );
  }

  // Backend: PATCH /api/cart/items/{cartItemId}?quantity={quantity}
  updateItemQuantity(cartItemId: string, quantity: number): Observable<CartDTO> {
    const params = new HttpParams().set('quantity', quantity.toString());

    return this.http.patch<CartDTO>(`${this.apiUrl}/items/${cartItemId}`, {}, { params }).pipe(
      tap(updatedCart => this.cartSubject.next(updatedCart))
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => this.cartSubject.next(null))
    );
  }

  clearLocalCartState() { this.cartSubject.next(null); }
}
