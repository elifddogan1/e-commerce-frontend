import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../checkout-flow/services/order.service';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrderDTO } from 'src/app/shared/models/order.model';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    ConfirmDialogModule,
    ToastModule,
    SkeletonModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  orders: OrderDTO[] = [];
  loading: boolean = true;
  error: string | null = null;
  expandedRows: { [key: string]: boolean } = {};

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(force: boolean = false): void {
    this.loading = true;
    this.error = null;
    this.orderService.getMyOrders(force).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
        this.error = 'Siparişleriniz yüklenirken bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Beklemede',
      'PREPARING': 'Hazırlanıyor',
      'SHIPPED': 'Kargoda',
      'DELIVERED': 'Teslim Edildi',
      'CANCELLED': 'İptal Edildi'
    };
    return statusMap[status] || status;
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'SHIPPED': return 'info';
      case 'PREPARING': return 'warn';
      case 'PENDING': return 'secondary';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  }

  canCancel(status: string): boolean {
    return status === 'PENDING' || status === 'CONFIRMED';
  }

  cancelOrder(orderId: string): void {
    this.confirmationService.confirm({
      message: 'Bu siparişi iptal etmek istediğinizden emin misiniz?',
      header: 'Sipariş İptali',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Evet, İptal Et',
      rejectLabel: 'Vazgeç',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-plain',
      accept: () => {
        this.orderService.cancelOrder(orderId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Başarılı',
              detail: 'Siparişiniz başarıyla iptal edildi.'
            });
            this.orderService.clearCache();
            this.fetchOrders(true);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Hata',
              detail: err.error?.message || 'Sipariş iptal edilirken bir hata oluştu.'
            });
          }
        });
      }
    });
  }

  toggleRow(id: string): void {
    this.expandedRows[id] = !this.expandedRows[id];
  }

  isExpanded(id: string): boolean {
    return !!this.expandedRows[id];
  }
}
