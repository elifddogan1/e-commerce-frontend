import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CartItemDTO } from '../../../../../../shared/models/cart.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {
  // Parent'tan gelen ürün verisi
  @Input({ required: true }) item!: CartItemDTO;

  // Parent'a gönderilecek olaylar
  @Output() remove = new EventEmitter<string>();
  @Output() updateQuantity = new EventEmitter<{ id: string, quantity: number }>();

  onRemove() {
    this.remove.emit(this.item.id);
  }

  onQuantityChange(newQuantity: number) {
  if (newQuantity === 0) {
    // Miktar 0 olursa ürünü sepetten sil
    this.remove.emit(this.item.id);
  } else if (newQuantity > 0 && newQuantity <= this.item.maxAvailableStock) {
    // Normal miktar güncellemesi
    this.updateQuantity.emit({ id: this.item.id, quantity: newQuantity });
  }
}
}
