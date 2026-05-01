import { Component, inject, OnInit, ChangeDetectorRef } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../core/auth/auth.service';
import { CartService } from "../../services/cart.service";
import { CartItemComponent } from "./components/cart-item/cart-item.component";
import { OrderService } from "../../services/order.service";
import { Divider } from "primeng/divider";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CartItemComponent,
    CurrencyPipe,
    Divider
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  public cartService = inject(CartService);
  public authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  cart$ = this.cartService.cart$;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.cartService.loadCart();
    }
  }

  // --- Eksik olan trackBy fonksiyonu ---
  trackById(index: number, item: any): string {
    return item.id;
  }

  removeItem(cartItemId: string) {
    this.cartService.removeCartItem(cartItemId).subscribe({
      next: () => this.cdr.detectChanges(),
      error: (err) => console.error('Hata:', err)
    });
  }

  updateItemQuantity(event: { id: string, quantity: number }) {
    this.cartService.updateItemQuantity(event.id, event.quantity).subscribe({
      next: () => this.cdr.detectChanges(),
      error: (err) => console.error('Miktar hatası:', err)
    });
  }
}