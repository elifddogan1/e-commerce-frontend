// cart.component.ts
import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../../core/auth/auth.service';
import { CartService } from "../../services/cart.service";
import { CartItemComponent } from "./components/cart-item/cart-item.component";
import { CheckoutRequest, OrderService } from "../../services/order.service";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CartItemComponent],
  templateUrl:'./cart.component.html'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  public authService = inject(AuthService);

  private orderService = inject(OrderService);

  private router = inject(Router);

  cart$ = this.cartService.cart$;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {

      this.cartService.loadCart();
    }
  }

  removeItem(cartItemId: string) {
    this.cartService.removeCartItem(cartItemId).subscribe({
      error: (err) => console.error('Ürün silinirken hata:', err)
    });
  }

  updateItemQuantity(event: { id: string, quantity: number }) {
    // Servisi çağırıyoruz. Tap içerisinde state güncellendiği için
    // HTML'deki cart$ otomatik olarak yeni veriyi (miktar ve fiyat) yansıtacaktır.
    this.cartService.updateItemQuantity(event.id, event.quantity).subscribe({
      error: (err) => {
        console.error('Miktar güncellenirken hata oluştu:', err);
        // Burada kullanıcıya stok yetersiz gibi bir mesaj verebilirsin
      }
    });
  }

  completeOrder(addressId: string) {
  const request: CheckoutRequest = { shippingAddressId: addressId };

  this.orderService.checkout(request).subscribe({
    next: (orders) => {
      // 1. Başarılı mesajı göster
      console.log('Sipariş başarıyla oluşturuldu!', orders);

      // 2. Frontend'deki sepeti anında temizle ki Navbar badge'i 0 olsun
      this.cartService.clearLocalCartState(); // CartService'e bu basit metodu eklemeliyiz

      // 3. Kullanıcıyı "Siparişlerim" sayfasına veya "Teşekkürler" sayfasına yönlendir
      this.router.navigate(['/profile/orders']);
    },
    error: (err) => console.error('Sipariş oluşturulamadı', err)
  });
}
}
