import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageProductDTO } from '../../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  /**
   * Tüm ürünleri sayfalama ve isteğe bağlı filtrelerle getirir
   * (Sıralama işlemi backend tarafından yönetilmektedir/kapatılmıştır)
   */
  getProducts(
    page: number = 0, // Spring Boot'ta sayfalar 0'dan başlar
    size: number = 12, // E-ticaret için 12, 24 gibi sayılar grid yapısına uygundur
    categoryId?: string, // Opsiyonel filtreler
    minPrice?: number,
    maxPrice?: number,
    searchTerm?: string
  ): Observable<PageProductDTO> {

    // Parametreleri URL'e uygun formata çeviriyoruz
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // Filtreler doluysa URL'e ekle (Undefined olanlar eklenmez, temiz bir istek gider)
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

    // İstek örneği: GET http://localhost:8080/api/products?page=0&size=12&categoryId=123
    return this.http.get<PageProductDTO>(this.apiUrl, { params });
  }
}
