import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products'
  },
  {
    path: 'products',
    // Ürün listeleme sayfasını lazy load ile yüklüyoruz
    loadComponent: () => import('./features/public/products/product-list/product-list.component')
      .then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    // Ürün detay sayfasını lazy load ile yüklüyoruz. ':id' parametresiyle UUID yakalanacak.
    loadComponent: () => import('./features/public/products/product-detail/product-detail.component')
      .then(m => m.ProductDetailComponent)
  },
  // İleride eklenecek diğer ana modüller için örnek yapı:
  /*
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/checkout-flow/cart/cart.component').then(m => m.CartComponent)
  }
  */
];