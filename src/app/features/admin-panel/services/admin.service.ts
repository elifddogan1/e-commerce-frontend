import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  pendingSellers: number;
  totalOrders: number;
  totalProducts: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) { }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getPendingSellers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sellers/pending`);
  }

  approveSeller(userId: string): Observable<string> {
    return this.http.patch(`${this.apiUrl}/sellers/${userId}/approve`, {}, { responseType: 'text' });
  }

  deactivateSeller(userId: string): Observable<string> {
    return this.http.patch(`${this.apiUrl}/sellers/${userId}/deactivate`, {}, { responseType: 'text' });
  }
}
