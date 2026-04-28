import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'; // Pipe'lar için eklendi
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router'; // RouterModule eklendi
import { switchMap } from 'rxjs/operators'; // Daha temiz veri çekimi için
import { ProductService } from '../../services/product.service';
import { ProductDTO, ProductVariantDTO, ReviewDTO } from '../../../../shared/models/product.model';
import { CartService } from '../../../checkout-flow/services/cart.service';

// PrimeNG v18 Güncel Modülleri
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RatingModule } from 'primeng/rating';
import { SelectModule } from 'primeng/select'; // PrimeNG 18 standardı

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule, // Navigasyon için gerekli
    ButtonModule,
    TagModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    RatingModule,
    SelectModule,
    // Pipe'ları standalone'da bazen direkt eklemek hatayı çözer
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

  product: ProductDTO | null = null;
  reviews: ReviewDTO[] = [];
  selectedVariant: ProductVariantDTO | null = null;
  loading: boolean = true;


  addToCart() {
    if (!this.selectedVariant) return;

    // Varsayılan olarak 1 adet ekliyoruz. İstersen arayüze bir miktar (quantity) input'u da koyabilirsin.
    this.cartService.addToCart(this.selectedVariant.id, 1).subscribe({
      next: (response) => {
        console.log('Sepete eklendi!', response);
        // this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Ürün sepete eklendi.' });
      },
      error: (err) => {
        console.error('Sepete eklenirken hata oluştu', err);
        // this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Stok yetersiz veya sunucu hatası.' });
      }
    });
  }

  ngOnInit() {
    // URL'deki ID değiştiğinde veriyi otomatik yenileyen yapı
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        this.loading = true;
        if (id) {
          // Önce yorumları çekelim (ürün gelene kadar başlasın)
          this.loadReviews(id);
          // Ürün detayını döndürelim
          return this.productService.getProductById(id);
        }
        return []; // ID yoksa boş dön
      })
    ).subscribe({
      next: (res: any) => {
        this.product = res;
        if (res && res.variants && res.variants.length > 0) {
          this.selectedVariant = res.variants[0];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Ürün yükleme hatası:', err);
        this.loading = false;
      }
    });
  }

  loadReviews(productId: string) {
    this.productService.getProductReviews(productId).subscribe({
      // res ve err için tipleri açıkça belirttik
      next: (res: ReviewDTO[]) => this.reviews = res,
      error: (err: any) => console.error('Yorum yükleme hatası:', err)
    });
  }


}