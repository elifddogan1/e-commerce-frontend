import { ProductDTO, PageProductDTO } from './../../../../shared/models/product.model';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

// PrimeNG v18 Güncel Modülleri
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    ButtonModule,
    TagModule,
    InputTextModule,
    PaginatorModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);

  products: ProductDTO[] = [];
  totalElements: number = 0;
  loading: boolean = true;

  currentPage: number = 0;
  pageSize: number = 12;

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;

    // Sort parametresi tamamen kaldırıldı, sadece sayfalama bilgileri gidiyor
    this.productService.getProducts(this.currentPage, this.pageSize)
      .subscribe({
        next: (response: any) => {
          if (response && response.content) {
              this.products = [...response.content];
              this.totalElements = response.totalElements;
          }
          this.loading = false;
          console.log('Component ürün sayısı:', this.products.length);
        },
        error: (err) => {
          console.error('Ürünler yüklenirken hata:', err);
          this.loading = false;
        }
      });
  }

  onPageChange(event: any) {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.loadProducts();
  }
}
