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
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  products: ProductDTO[] = [];
  totalElements: number = 0;
  loading: boolean = true;

  currentPage: number = 0;
  pageSize: number = 25;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.productService.getProducts(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: any) => {
          if (response && response.content) {
            this.products = [...response.content];
            this.totalElements = response.totalElements;
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Hata:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  addToCart(product: any): void {
    if (!product.variants || product.variants.length === 0) return;

    const defaultVariantId = product.variants[0].id;

    this.cartService.addToCart({
      variantId: defaultVariantId,
      quantity: 1
    }).subscribe({
      next: () => console.log('Sepete eklendi'),
      error: (err) => console.error(err)
    });
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.loadProducts();
  }

  toggleFavorite(product: ProductDTO): void {
    // Favori mantığı buraya gelecek
  }
}