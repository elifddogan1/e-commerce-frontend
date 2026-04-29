// core/services/order.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

export interface CheckoutRequest {
  shippingAddressId: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  // 1. Müşteri Siparişi Tamamlar
  checkout(request: CheckoutRequest): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/checkout`, request);
  }

  // 2. Müşteri Kendi Siparişlerini Görür
  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-orders`);
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
}
