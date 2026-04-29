import { PaymentService } from './../../services/payment.service';
import { OrderService } from './../../services/order.service';
import { CartService } from './../../services/cart.service';
import { AddressService } from './../../../../shared/services/address.service';
import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG & Stripe
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StripeService, StripeCardComponent, NgxStripeModule } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, CardModule, RadioButtonModule, ToastModule, NgxStripeModule],
  providers: [MessageService],
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit {
  // Stripe Kart elementini yakalamak için
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  // Servisler
  private addressService = inject(AddressService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private stripeService = inject(StripeService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  // UI States
  addresses = signal<any[]>([]);
  cart$ = this.cartService.cart$;
  selectedAddressId = signal<string | null>(null);
  currentStep = signal<'ADDRESS' | 'PAYMENT'>('ADDRESS');
  isProcessing = signal(false);

  // Data State
  checkoutData = signal<{ orderIds: string[], totalAmount: number } | null>(null);

  // Stripe CSS ve Yapılandırma Ayarları
  cardOptions: StripeCardElementOptions = {
    style: { base: { color: '#32325d', fontFamily: 'Arial, sans-serif', fontSize: '16px' } }
  };

  // KRİTİK: Bu nesne olmadan kart formu yüklenmez!
  elementsOptions: StripeElementsOptions = {
    locale: 'tr'
  };

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.addressService.getMyAddresses().subscribe({
      next: (data) => {
        this.addresses.set(data);
        const def = data.find(a => a.isDefault);
        if (def) this.selectedAddressId.set(def.id!);
      },
      error: () => this.handleError('Adresler yüklenirken hata oluştu.')
    });
  }

  // --- ADIM 1: SİPARİŞİ OLUŞTUR (PENDING) ---
  proceedToPayment() {
    if (!this.selectedAddressId()) {
      this.messageService.add({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen bir adres seçin.' });
      return;
    }

    this.isProcessing.set(true);

    this.orderService.checkout({ shippingAddressId: this.selectedAddressId()! }).subscribe({
      next: (res: any) => {
        // Backend'den gelen DTO'yu sinyale kaydet
        this.checkoutData.set({
          orderIds: res.orderIds,
          totalAmount: res.totalAmount
        });

        // Adımı PAYMENT olarak değiştir ve DOM'un güncellenmesini bekle
        this.currentStep.set('PAYMENT');
        this.isProcessing.set(false);
      },
      error: (err) => {
        this.isProcessing.set(false);
        this.handleError('Sipariş oluşturulurken bir teknik sorun oluştu.');
      }
    });
  }

  // --- ADIM 2: STRIPE İLE ÖDEMEYİ AL ---
  pay() {
    // 1. Önce kart formunun (HTML'deki ngx-stripe-card) hazır olduğundan emin ol!
    if (!this.card || !this.card.element) {
      this.handleError('Kart formu yükleniyor, lütfen bir saniye bekleyip tekrar deneyin.');
      return;
    }

    const amount = this.checkoutData()?.totalAmount;
    if (!amount) {
      this.handleError('Ödenecek tutar bulunamadı.');
      return;
    }

    this.isProcessing.set(true);

    // 2. Backend'den Intent (Ödeme İzni) al
    this.paymentService.createPaymentIntent(amount).subscribe({
      next: (res) => {

        // 3. İzni aldıktan sonra Stripe'a "İşte bu kartla öde" diyoruz (Eski hatalı kod buradaydı, düzeltildi)
        this.stripeService.confirmCardPayment(res.clientSecret, {
          payment_method: {
            card: this.card.element // Doğru kullanım budur!
          }
        }).subscribe((result) => {
          if (result.error) {
            // Kart reddedildi veya hata var
            this.handleError(result.error.message || 'Ödeme reddedildi.');
          } else if (result.paymentIntent?.status === 'succeeded') {
            // Ödeme Stripe'dan geçti, şimdi kendi veritabanımızı güncelleyelim
            this.confirmOrderOnBackend(result.paymentIntent.id);
          }
        });

      },
      error: () => this.handleError('Ödeme altyapısına ulaşılamadı.')
    });
  }

  // --- ADIM 3: SİPARİŞİ ONAYLA (CONFIRMED) ---
  confirmOrderOnBackend(paymentId: string) {
    const ids = this.checkoutData()?.orderIds || [];

    this.paymentService.confirmPayment(ids, paymentId).subscribe({
      next: () => {
        this.cartService.clearLocalCartState(); // Sepeti sağ taraftan sil
        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Ödemeniz onaylandı! Siparişiniz hazırlanıyor.' });

        // İşlem bitti, kullanıcıyı yönlendir
        setTimeout(() => this.router.navigate(['/user-panel/my-orders']), 2000);
      },
      error: () => {
        this.handleError('Ödeme alındı ancak sipariş durumu güncellenemedi. Lütfen destekle iletişime geçin.');
      }
    });
  }

  // Genel Hata Yönetimi
  private handleError(msg: string) {
    this.isProcessing.set(false);
    this.messageService.add({ severity: 'error', summary: 'Hata', detail: msg });
  }
}
