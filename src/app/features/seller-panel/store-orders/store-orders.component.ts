import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../checkout-flow/services/order.service';
import { OrderDTO } from '../../../shared/models/order.model';

@Component({
  selector: 'app-store-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './store-orders.component.html',
  styleUrl: './store-orders.component.scss'
})
export class StoreOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  orders: OrderDTO[] = [];
  loading = true;
  error: string | null = null;
  expandedOrderIds = new Set<string>();

  readonly statusOptions = [
    { label: 'Beklemede', value: 'PENDING', class: 'status-pending' },
    { label: 'Onaylandı', value: 'CONFIRMED', class: 'status-confirmed' },
    { label: 'Kargolandı', value: 'SHIPPED', class: 'status-shipped' },
    { label: 'Teslim Edildi', value: 'DELIVERED', class: 'status-delivered' },
    { label: 'İptal Edildi', value: 'CANCELLED', class: 'status-cancelled' },
    { label: 'İade Edildi', value: 'RETURNED', class: 'status-returned' }
  ];

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.orderService.getStoreOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Siparişler yüklenirken bir hata oluştu.';
        this.loading = false;
        this.cdr.detectChanges();
        console.error(err);
      }
    });
  }

  updateStatus(orderId: string, newStatus: string): void {
    this.orderService.updateOrderStatus(orderId, newStatus).subscribe({
      next: () => {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
          order.status = newStatus;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        alert('Durum güncellenirken bir hata oluştu.');
      }
    });
  }

  getStatusClass(status: string): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.class : 'status-default';
  }

  getStatusLabel(status: string): string {
    const option = this.statusOptions.find(o => o.value === status);
    return option ? option.label : status;
  }

  toggleOrderDetails(orderId: string): void {
    if (this.expandedOrderIds.has(orderId)) {
      this.expandedOrderIds.delete(orderId);
    } else {
      this.expandedOrderIds.add(orderId);
    }
    this.cdr.detectChanges();
  }

  isExpanded(orderId: string): boolean {
    return this.expandedOrderIds.has(orderId);
  }
}