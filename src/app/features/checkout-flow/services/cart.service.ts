import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CartDTO, CartItemDTO, AddToCartRequest } from '../../../shared/models/cart.model';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  // Global sepet durumu
  private cartSubject = new BehaviorSubject<CartDTO | null>(null);
  public cart$ = this.cartSubject.asObservable();

  // Navbar'daki badge için toplam miktar (Reaktif)
  public cartItemCount$ = this.cart$.pipe(
    map(cart => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0)
  );

  getCurrentCart(): Observable<CartDTO> {
    return this.http.get<CartDTO>(this.apiUrl).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addToCart(request: AddToCartRequest): Observable<CartDTO> {
    return this.http.post<CartDTO>(`${this.apiUrl}/items`, request).pipe(
      tap(updatedCart => this.cartSubject.next(updatedCart))
    );
  }

  removeCartItem(cartItemId: string): Observable<CartDTO> {
    return this.http.delete<CartDTO>(`${this.apiUrl}/remove/${cartItemId}`).pipe(
      tap(updatedCart => this.cartSubject.next(updatedCart))
    );
  }

  updateItemQuantity(cartItemId: string, quantity: number): Observable<CartDTO> {
    return this.http.put<CartDTO>(`${this.apiUrl}/update`, { cartItemId, quantity }).pipe(
      tap(updatedCart => this.cartSubject.next(updatedCart))
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear`).pipe(
      tap(() => this.cartSubject.next(null))
    );
  }
}