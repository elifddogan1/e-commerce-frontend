import { Routes } from '@angular/router';
// Component'leri en başa, tertemiz import ediyoruz
import { ProductListComponent } from './features/public/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/public/products/product-detail/product-detail.component';
import { CartComponent } from './features/checkout-flow/cart/cart/cart.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products'
  },
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
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'cart',
    title: 'Sepetim | E-Ticaret',
    component: CartComponent,
    canActivate: [authGuard]
  },
  // Hatalı bir URL girilirse her zaman ürünlere döndür
  {
    path: '**',
    redirectTo: 'products'
  }
];