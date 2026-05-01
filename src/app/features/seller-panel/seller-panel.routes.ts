import { Routes } from '@angular/router';
import { StoreOrdersComponent } from './store-orders/store-orders.component';

export const SELLER_PANEL_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'orders',
    pathMatch: 'full'
  },
  {
    path: 'orders',
    title: 'Sipariş Yönetimi | Satıcı Paneli',
    component: StoreOrdersComponent
  }
  // Diğer satıcı sayfaları (inventory, dashboard vb.) buraya eklenebilir
];
