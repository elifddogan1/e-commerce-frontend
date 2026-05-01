import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryDTO, ProductDTO } from '../../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getMyStoreProducts(page: number = 0, size: number = 12): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/my-store`, { params });
  }

  createProduct(productData: any): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(this.apiUrl, productData);
  }

  uploadImages(productId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return this.http.post(`${this.apiUrl}/${productId}/images`, formData);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(`${environment.apiUrl}/categories/main`);
  }
}