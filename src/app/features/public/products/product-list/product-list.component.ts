import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Servisler ve Modeller
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../checkout-flow/services/cart.service';
import { ProductDTO } from './../../../../shared/models/product.model';

// PrimeNG v18+ Modülleri
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DataViewModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    PaginatorModule,
    TooltipModule,
    ProgressSpinnerModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  // Bağımlılıklar (Inject)
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef); // Hata çözümü için kritik

  // State (Durum) Değişkenleri
  products: ProductDTO[] = [];
  totalElements: number = 0;
  loading: boolean = true; // Başlangıç değeri true kalsın

  // Sayfalama Ayarları
  currentPage: number = 0;
  pageSize: number = 12;

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Ürünleri API'den çeker ve state'i günceller
   */
  loadProducts(): void {
    this.loading = true;

    // Değer değişimini Angular'a hemen bildir (NG0100 hatasını engeller)
    this.cdr.detectChanges();

    this.productService.getProducts(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: any) => {
          if (response && response.content) {
            this.products = [...response.content];
            this.totalElements = response.totalElements;
          }
          this.loading = false;
          // Veri geldikten sonra ekranı tekrar güncelle
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Ürünler yüklenirken hata:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Ürünü sepete ekler (Varyant kontrolü ile)
   */
  addToCart(product: any): void {
    if (!product.variants || product.variants.length === 0) {
      console.warn('Bu ürünün varyantı bulunmuyor.');
      return;
    }

    const defaultVariantId = product.variants[0].id;

    this.cartService.addToCart(defaultVariantId, 1).subscribe({
      next: (response) => {
        console.log('Ürün sepete eklendi:', response);
        // Burada isteğe bağlı olarak PrimeNG MessageService ile Toast gösterilebilir
      },
      error: (err) => console.error('Sepete ekleme hatası:', err)
    });
  }

  /**
   * Sayfa değişim olayını yakalar
   */
  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.loadProducts();
  }

  /**
   * Favori ikonunu tetikler
   */
  toggleFavorite(product: ProductDTO): void {
    console.log('Favori işlemi:', product.id);
  }
}