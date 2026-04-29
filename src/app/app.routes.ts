import { MyAddressesComponent } from './features/user-panel/my-addresses/my-addresses/my-addresses.component';
import { Routes } from '@angular/router';

// Bileşen Importları (Feature bazlı)
import { ProductListComponent } from './features/public/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/public/products/product-detail/product-detail.component';
import { CartComponent } from './features/checkout-flow/cart/cart/cart.component';
import { CheckoutPageComponent } from './features/checkout-flow/pages/checkout-page/checkout-page.component';

// Core & Guard
import { authGuard } from './core/guards/auth.guard';
import { AUTH_ROUTES } from './features/auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products'
  },

  // Public (Herkes görebilir)
  {
    path: 'products',
    title: 'Ürünler | E-Ticaret',
    component: ProductListComponent
  },
  {
    path: 'products/:id',
    title: 'Ürün Detayı | E-Ticaret',
    component: ProductDetailComponent
  },

  // Auth (Giriş/Kayıt - auth.routes içindeki alt rotalar)
  {
    path: 'auth',
    children: AUTH_ROUTES // AUTH_ROUTES'u yukarıda import ettik
  },

  // Sepet (Misafir girebilir, ama SELLER/ADMIN giremez)
  {
    path: 'cart',
    title: 'Sepetim | E-Ticaret',
    component: CartComponent,
    canActivate: [authGuard],
    data: { forbiddenRoles: ['SELLER', 'ADMIN'] }
  },

  // Checkout (SADECE giriş yapmış USER rolü girebilir)
  {
    path: 'checkout',
    title: 'Siparişi Tamamla | E-Ticaret',
    component: CheckoutPageComponent,
    canActivate: [authGuard],
    data: { requiredRoles: ['USER'] }
  },

  // Kullanıcı Paneli (SADECE giriş yapmış USER rolü girebilir)
  {
    path: 'user-panel',
    canActivate: [authGuard],
    data: { requiredRoles: ['USER'] },
    children: [
      {
        path: 'my-addresses',
        title: 'Adreslerim | E-Ticaret',
        component: MyAddressesComponent
      },
      // Gelecekte my-orders gibi sayfalar buraya eklenecek
    ]
  },

  // Hatalı rotaları anasayfaya at
  {
    path: '**',
    redirectTo: 'products'
  }
];
