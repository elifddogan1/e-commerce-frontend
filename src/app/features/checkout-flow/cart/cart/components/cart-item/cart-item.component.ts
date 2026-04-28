import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CartItemDTO } from '../../../../../../shared/models/cart.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './cart-item.component.html', // Ayrı dosyayı işaret ediyoruz
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItemDTO;

  @Output() remove = new EventEmitter<string>();
  @Output() updateQuantity = new EventEmitter<{ id: string, quantity: number }>();

  onRemove() {
    this.remove.emit(this.item.id);
  }

  onQuantityChange(newQuantity: number) {
    if (newQuantity > 0 && newQuantity <= this.item.maxAvailableStock) {
      this.updateQuantity.emit({ id: this.item.id, quantity: newQuantity });
    }
  }
}