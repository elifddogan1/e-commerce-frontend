import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadgeModule } from 'primeng/badge';
import { CategoryService } from '../../../features/public/services/category.service';
import { CartService } from '../../../features/checkout-flow/services/cart.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenubarModule,
    ButtonModule,
    InputTextModule,
    BadgeModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private cartService = inject(CartService);
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  items: MenuItem[] = [];
  cartItemCount: number = 0;

  ngOnInit(): void {
    this.buildMenu();
    this.subscribeToCart();
  }

  private subscribeToCart(): void {
    this.cartService.cart$.subscribe(cart => {
      // cart?.items?.length: cart varsa items'a bak, items varsa length'e bak.
      // ?? 0: Eğer sonuç null ise 0 ata.
      this.cartItemCount = cart?.items?.length ?? 0;
      this.cdr.detectChanges();
    });
  }

  buildMenu(): void {
    if (this.authService.isAdmin()) {
      // Admin Menüsü
      this.items = [
        { label: 'Admin Dashboard', icon: 'pi pi-chart-line', routerLink: ['/admin/dashboard'] },
        { label: 'Kategoriler', icon: 'pi pi-tags', routerLink: ['/admin/categories'] },
        { label: 'Satıcı Onayları', icon: 'pi pi-user-plus', routerLink: ['/admin/seller-approvals'] }
      ];
    } else if (this.authService.isSeller()) {
      // Satıcı Menüsü
      this.items = [
        { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: ['/seller-panel/dashboard'] },
        { label: 'Siparişler', icon: 'pi pi-shopping-bag', routerLink: ['/seller-panel/orders'] },
        { label: 'Ürün Yönetimi', icon: 'pi pi-box', routerLink: ['/seller-panel/my-products'] }
      ];
    } else {
      // Müşteri/Ziyaretçi Menüsü
      this.items = [
        { label: 'Tüm Ürünler', icon: 'pi pi-th-large', routerLink: ['/products'] },
        { label: 'Kategoriler', icon: 'pi pi-tags', items: [] }
      ];
      this.loadCategories();
    }
  }

  private loadCategories(): void {
    this.categoryService.getMainCategories().subscribe({
      next: (categories: any[]) => {
        const categoryItems = categories.map(cat => ({
          label: cat.name,
          routerLink: ['/products'],
          queryParams: { categoryId: cat.id }
        }));

        this.items[1].items = categoryItems;
        this.cdr.detectChanges();
      }
    });
  }
}