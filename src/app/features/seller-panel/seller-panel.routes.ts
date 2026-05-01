import { Routes } from '@angular/router';
import { StoreOrdersComponent } from './store-orders/store-orders.component';
import { AddProductComponent } from './add-product/add-product/add-product.component';
import { StoreInventoryComponent } from './inventory/store-inventory/store-inventory.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';

export const SELLER_PANEL_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'my-products', // Satıcı panele girince direkt ürünlerine düşsün istersen (opsiyonel)
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    title: 'Dashboard | Satıcı Paneli',
    component: DashboardComponent
  },
  {
    path: 'orders',
    title: 'Sipariş Yönetimi | Satıcı Paneli',
    component: StoreOrdersComponent
  },
  {
    // URL artık /seller-panel/products değil, /seller-panel/my-products oldu
    path: 'my-products',
    children: [
      {
        path: '',
        title: 'Ürünlerim | Satıcı Paneli',
        component: StoreInventoryComponent
      },
      {
        path: 'add',
        title: 'Yeni Ürün Ekle | Satıcı Paneli',
        component: AddProductComponent
      }
    ]
  }
];