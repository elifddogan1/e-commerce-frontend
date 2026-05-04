// core/services/order.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CheckoutRequest {
  shippingAddressId: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  private myOrdersCache$ = new BehaviorSubject<any[] | null>(null);

  // 1. Müşteri Siparişi Tamamlar
  // features/checkout-flow/services/order.service.ts
  checkout(request: { shippingAddressId: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkout`, request);
  }

  // 2. Müşteri Kendi Siparişlerini Görür
  getMyOrders(forceRefresh: boolean = false): Observable<any[]> {
    if (!forceRefresh && this.myOrdersCache$.value) {
      return this.myOrdersCache$.asObservable() as Observable<any[]>;
    }
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`).pipe(
      tap(orders => this.myOrdersCache$.next(orders))
    );
  }

  clearCache(): void {
    this.myOrdersCache$.next(null);
  }

  // 3. Satıcı Kendi Mağazasına Gelen Siparişleri Görür
  getStoreOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/store-orders`);
  }

  // 4. Satıcı Sipariş Durumunu Günceller (Örn: Hazırlanıyor -> Kargoya Verildi)
  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.patch<any>(`${this.apiUrl}/${orderId}/status`, {}, { params });
  }

  // 5. Müşteri Kendi Siparişini İptal Eder
  cancelOrder(orderId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${orderId}/cancel`, {});
  }
}
