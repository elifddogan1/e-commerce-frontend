import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Ekledik
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../../checkout-flow/services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // RouterModule eklendi
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  stats = {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0
  };

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.loading = true;

    forkJoin({
      orders: this.orderService.getStoreOrders(),
      products: this.productService.getMyStoreProducts(0, 1)
    }).subscribe({
      next: (res: any) => {
        const orders = res.orders;

        this.stats.totalOrders = orders.length;
        this.stats.pendingOrders = orders.filter((o: any) => o.status === 'PENDING').length;

        this.stats.totalRevenue = orders
          .filter((o: any) => o.status !== 'CANCELLED' && o.status !== 'RETURNED')
          .reduce((acc: number, curr: any) => acc + (curr.total || 0), 0);

        this.stats.totalProducts = res.products.totalElements;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Dashboard yüklenemedi:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}