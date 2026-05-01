import { Routes } from '@angular/router';
import { AUTH_ROUTES } from 'src/app/features/auth/auth.routes';
import { CartComponent } from 'src/app/features/checkout-flow/cart/cart/cart.component';
import { CheckoutPageComponent } from 'src/app/features/checkout-flow/pages/checkout-page/checkout-page.component';
import { ProductDetailComponent } from 'src/app/features/public/products/product-detail/product-detail.component';
import { ProductListComponent } from 'src/app/features/public/products/product-list/product-list.component';
import { MyAddressesComponent } from 'src/app/features/user-panel/my-addresses/my-addresses/my-addresses.component';
// import { MyAddressesComponent} from './features/user-panel/m
import { authGuard } from './core/guards/auth.guard';
// // Bileşen Importları
// import { ProductListComponent } from './features/public/products/product-list/product-list.component';
// import { ProductDetailComponent } from './features/public/products/product-detail/product-detail.component';
// import { CartComponent } from './features/checkout-flow/cart/cart/cart.component';
// import { CheckoutPageComponent } from './features/checkout-flow/pages/checkout-page/checkout-page.component';

// // Core & Guard
// import { authGuard } from './core.*';
// import { AUTH_ROUTES } from './features/auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products'
  },

  // Public Ürünler (SELLER VE ADMIN GİREMEZ)
  {
    path: 'products',
    title: 'Ürünler | E-Ticaret',
    component: ProductListComponent,
    canActivate: [authGuard],
    data: { forbiddenRoles: ['SELLER', 'ADMIN'] }
  },
  {
    path: 'products/:id',
    title: 'Ürün Detayı | E-Ticaret',
    component: ProductDetailComponent,
    canActivate: [authGuard],
    data: { forbiddenRoles: ['SELLER', 'ADMIN'] }
  },

  // Auth
  {
    path: 'auth',
    children: AUTH_ROUTES
  },

  // Sepet (Sadece USER görebilir)
  {
    path: 'cart',
    title: 'Sepetim | E-Ticaret',
    component: CartComponent,
    canActivate: [authGuard],
    data: { forbiddenRoles: ['SELLER', 'ADMIN'] }
  },

  // Checkout (Sadece USER işlem yapabilir)
  {
    path: 'checkout',
    title: 'Siparişi Tamamla | E-Ticaret',
    component: CheckoutPageComponent,
    canActivate: [authGuard],
    data: { requiredRoles: ['USER'] }
  },

  // Kullanıcı Paneli
  {
    path: 'user-panel',
    canActivate: [authGuard],
    data: { requiredRoles: ['USER'] },
    children: [
      {
        path: 'my-addresses',
        title: 'Adreslerim | E-Ticaret',
        component: MyAddressesComponent
      }
    ]
  },

  // Satıcı Paneli
  {
    path: 'seller-panel',
    canActivate: [authGuard],
    data: { requiredRoles: ['SELLER'] },
    loadChildren: () => import('./features/seller-panel/seller-panel.routes').then(m => m.SELLER_PANEL_ROUTES)
  },

  // Admin Paneli
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { requiredRoles: ['ADMIN'] },
    loadChildren: () => import('./features/admin-panel/admin-panel.routes').then(m => m.ADMIN_PANEL_ROUTES)
  },

  // Wildcard Route - Bulunamayan sayfaları ana sayfaya atar
  {
    path: '**',
    redirectTo: 'products'
  }
];        