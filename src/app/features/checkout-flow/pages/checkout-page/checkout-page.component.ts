import { Component, OnInit, inject, signal, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Servisler
import { AddressService } from './../../../../shared/services/address.service';
import { CartService } from './../../services/cart.service';
import { OrderService } from './../../services/order.service';
import { PaymentService } from './../../services/payment.service';

// PrimeNG & Stripe
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { StripeService, StripeCardComponent, NgxStripeModule } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    RadioButtonModule,
    ToastModule,
    DividerModule,
    NgxStripeModule,
    CurrencyPipe
  ],
  providers: [MessageService],
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent implements OnInit {
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

  private addressService = inject(AddressService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private paymentService = inject(PaymentService);
  private stripeService = inject(StripeService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  addresses = signal<any[]>([]);
  cart$ = this.cartService.cart$;
  selectedAddressId = signal<string | null>(null);
  currentStep = signal<'ADDRESS' | 'PAYMENT'>('ADDRESS');
  isProcessing = signal(false);

  checkoutData = signal<{ orderIds: string[], totalAmount: number } | null>(null);

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        color: '#1e293b',
        fontFamily: '"Inter", sans-serif',
        fontSize: '16px',
        '::placeholder': { color: '#94a3b8' }
      }
    }
  };

  elementsOptions: StripeElementsOptions = { locale: 'tr' };

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.addressService.getMyAddresses().subscribe({
      next: (data) => {
        this.addresses.set(data);
        const def = data.find(a => a.isDefault);
        if (def) this.selectedAddressId.set(def.id!);
        this.cdr.detectChanges();
      },
      error: () => this.handleError('Adresler yüklenirken hata oluştu.')
    });
  }

  proceedToPayment() {
    if (!this.selectedAddressId()) {
      this.messageService.add({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen bir adres seçin.' });
      return;
    }
    this.isProcessing.set(true);
    this.orderService.checkout({ shippingAddressId: this.selectedAddressId()! }).subscribe({
      next: (res: any) => {
        this.checkoutData.set({ orderIds: res.orderIds, totalAmount: res.totalAmount });
        this.currentStep.set('PAYMENT');
        this.isProcessing.set(false);
        this.cdr.detectChanges();
      },
      error: () => this.handleError('Sipariş oluşturulurken bir teknik sorun oluştu.')
    });
  }

  pay() {
    if (!this.card?.element) {
      this.handleError('Kart formu yükleniyor, lütfen tekrar deneyin.');
      return;
    }
    const amount = this.checkoutData()?.totalAmount;
    if (!amount) return;

    this.isProcessing.set(true);
    this.paymentService.createPaymentIntent(amount).subscribe({
      next: (res) => {
        this.stripeService.confirmCardPayment(res.clientSecret, {
          payment_method: { card: this.card.element }
        }).subscribe((result) => {
          if (result.error) {
            this.handleError(result.error.message || 'Ödeme reddedildi.');
          } else if (result.paymentIntent?.status === 'succeeded') {
            this.confirmOrderOnBackend(result.paymentIntent.id);
          }
        });
      },
      error: () => this.handleError('Ödeme altyapısına ulaşılamadı.')
    });
  }

  confirmOrderOnBackend(paymentId: string) {
    const ids = this.checkoutData()?.orderIds || [];
    this.paymentService.confirmPayment(ids, paymentId).subscribe({
      next: () => {
        this.cartService.clearLocalCartState();
        this.orderService.clearCache();
        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Ödemeniz onaylandı!' });
        setTimeout(() => this.router.navigate(['/user-panel/my-orders']), 2000);
      },
      error: () => this.handleError('Ödeme onaylanırken hata oluştu.')
    });
  }

  private handleError(msg: string) {
    this.isProcessing.set(false);
    this.messageService.add({ severity: 'error', summary: 'Hata', detail: msg });
    this.cdr.detectChanges();
  }
}