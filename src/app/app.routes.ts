import { Routes } from '@angular/router';
import { ProductListComponent } from './features/public/products/product-list/product-list.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full', // Tam eşleşme olduğunda
    redirectTo: 'products' // Sadece yönlendir, bileşen verme!
  },
  {
    path: 'products',
    component: ProductListComponent // Bileşeni burada tanımla
  }
];
