import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef eklendi
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
  public authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef); // 1. ChangeDetectorRef'i inject ediyoruz

  items: MenuItem[] = [];
  cartItemCount: number = 0;

  ngOnInit(): void {
    // 2. Menünün başlangıç iskeletini hemen veriyoruz ki Angular sıfırdan doluya geçerken şaşırmasın
    this.items = [
      { label: 'Tüm Ürünler', icon: 'pi pi-fw pi-box', routerLink: ['/products'] },
      { label: 'Kategoriler', icon: 'pi pi-fw pi-tags', items: [{ label: 'Yükleniyor...' }] }
    ];
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getMainCategories().subscribe({
      next: (categories: any[]) => {
        const categoryItems: MenuItem[] = categories.map((cat: any) => ({
          label: cat.name,
          routerLink: ['/products'],
          queryParams: { categoryId: cat.id }
        }));

        this.items = [
          {
            label: 'Tüm Ürünler',
            icon: 'pi pi-fw pi-box',
            routerLink: ['/products']
          },
          {
            label: 'Kategoriler',
            icon: 'pi pi-fw pi-tags',
            items: categoryItems.length > 0 ? categoryItems : [{ label: 'Kategori bulunamadı' }]
          }
        ];

        // 3. Veri geldikten sonra Angular'a manuel olarak kontrol etmesini söylüyoruz
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Kategoriler yüklenemedi:', err);
        this.items = [
          { label: 'Tüm Ürünler', icon: 'pi pi-fw pi-box', routerLink: ['/products'] }
        ];

        // Hata durumunda da menüyü güncellediğimiz için tetikliyoruz
        this.cdr.detectChanges();
      }
    });
  }
}
