import { Routes } from '@angular/router';
import { ProductListComponent } from './features/public/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/public/products/product-detail/product-detail.component';
import { CartComponent } from './features/checkout-flow/cart/cart/cart.component';
import { authGuard } from './core/guards/auth.guard'; // Guard import edildi

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
    canActivate: [authGuard], // Guard eklendi
    data: { forbiddenRoles: ['SELLER', 'ADMIN'] } // Satıcı ve Admin giremez
  },
  {
    path: '**',
    redirectTo: 'products'
  }
];
