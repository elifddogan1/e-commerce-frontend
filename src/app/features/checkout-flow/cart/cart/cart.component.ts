import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { CartItemComponent } from "./components/cart-item/cart-item.component";
import { CartService } from "../../services/cart.service";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CartItemComponent],
  template: `
    <div class="cart-container" *ngIf="cart$ | async as cart">
      <h2>Sepetim ({{ cart.cartTotal }} TL)</h2>
      
      <app-cart-item 
        *ngFor="let item of cart.items" 
        [item]="item" 
        (remove)="removeItem($event)">
      </app-cart-item>
      
      <button >Ödemeye Geç</button>
    </div>
  `
})
export class CartComponent {
  private cartService = inject(CartService);
  cart$ = this.cartService.cart$; // Global state'den oku

  removeItem(cartItemId: string) {
    this.cartService.removeCartItem(cartItemId).subscribe();
  }
}