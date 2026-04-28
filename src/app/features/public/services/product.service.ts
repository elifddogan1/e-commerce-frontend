import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageProductDTO, ProductDTO, ReviewDTO } from '../../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  // API URL'lerini environment üzerinden alıyoruz
  private apiUrl = `${environment.apiUrl}/products`;
  private reviewsApiUrl = `${environment.apiUrl}/reviews`;

  /**
   * Tüm ürünleri sayfalama ve isteğe bağlı filtrelerle getirir
   */
  getProducts(
    page: number = 0,
    size: number = 12,
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    searchTerm?: string
  ): Observable<PageProductDTO> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (categoryId) {
      params = params.set('categoryId', categoryId);
    }
    if (minPrice !== undefined) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice !== undefined) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }

    return this.http.get<PageProductDTO>(this.apiUrl, { params });
  }

  /**
   * Belirli bir ürünün detaylarını getirir
   */
  getProductById(id: string): Observable<ProductDTO> {
    return this.http.get<ProductDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Belirli bir ürüne ait müşteri değerlendirmelerini getirir
   */
  getProductReviews(productId: string): Observable<ReviewDTO[]> {
    return this.http.get<ReviewDTO[]>(`${this.reviewsApiUrl}/product/${productId}`);
  }
}