import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  // features/checkout-flow/services/payment.service.ts
  createPaymentIntent(amount: number): Observable<{ clientSecret: string }> {
    // Backend @RequestParam BigDecimal amount beklediği için params kullanıyoruz
    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/intent`, null, {
      params: { amount: amount.toString() }
    });
  }

  // Ödeme başarılı olunca backend'deki siparişleri onaylar
  confirmPayment(orderIds: string[], stripePaymentId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/confirm`, orderIds, {
      params: { stripePaymentId }
    });
  }
}
