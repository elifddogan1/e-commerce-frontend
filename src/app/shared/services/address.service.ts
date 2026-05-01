import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddressDTO } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/addresses`;

  // Tüm adresleri listele
  getMyAddresses(): Observable<AddressDTO[]> {
    return this.http.get<AddressDTO[]>(this.apiUrl);
  }

  // Yeni adres ekle
  createAddress(address: AddressDTO): Observable<AddressDTO> {
    return this.http.post<AddressDTO>(this.apiUrl, address);
  }

  // Varsayılan adresi belirle
  setDefaultAddress(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/default`, {});
  }

  // Adresi sil
  deleteAddress(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
