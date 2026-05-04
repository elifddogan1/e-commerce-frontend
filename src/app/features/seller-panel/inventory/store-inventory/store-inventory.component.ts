import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { ProductDTO } from '../../../../shared/models/product.model';

@Component({
  selector: 'app-store-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './store-inventory.component.html',
  styleUrl: './store-inventory.component.scss'
})
export class StoreInventoryComponent implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  products: ProductDTO[] = [];
  loading = true;
  error: string | null = null;

  currentPage = 0;
  pageSize = 25;
  totalPages = 0;
  totalElements = 0;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.productService.getMyStoreProducts(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.products = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ürünler yüklenirken bir sorun oluştu.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: () => alert('Ürün silinirken bir hata oluştu.')
      });
    }
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }
}