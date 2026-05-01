import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ProductService } from '../../services/product.service';
import { ProductDTO, ProductVariantDTO, ReviewDTO } from '../../../../shared/models/product.model';
import { CartService } from '../../../checkout-flow/services/cart.service';

// PrimeNG v18 Modülleri
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    TagModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    RatingModule,
    SelectModule,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);

  product: ProductDTO | null = null;
  reviews: ReviewDTO[] = [];
  selectedVariant: ProductVariantDTO | null = null;
  loading: boolean = true;

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.loading = true;
        this.cdr.detectChanges();
        if (id) {
          this.loadReviews(id);
          return this.productService.getProductById(id);
        }
        return [];
      })
    ).subscribe({
      next: (res: any) => {
        this.product = res;
        if (res?.variants?.length > 0) {
          this.selectedVariant = res.variants[0];
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadReviews(productId: string) {
    this.productService.getProductReviews(productId).subscribe({
      next: (res: ReviewDTO[]) => {
        this.reviews = res;
        this.cdr.detectChanges();
      }
    });
  }

  addToCart() {
    if (!this.selectedVariant) return;
    this.cartService.addToCart({
      variantId: this.selectedVariant.id,
      quantity: 1
    }).subscribe({
      next: () => alert('Ürün sepete eklendi!'),
      error: (err) => console.error(err)
    });
  }
}