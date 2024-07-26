import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { CartComponent } from './features/cart/cart.component';
import { DetailsComponent } from './features/details/details.component';

export const routes: Routes = [
  {path: 'products', component: ProductsComponent},
  {path: 'products-details/:id',     loadComponent: () =>
    import('./features/details/details.component').then((c) => c.DetailsComponent)
  },
  {path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then((c) => c.CartComponent)

  },

  {path: '', redirectTo: '/products', pathMatch: 'full'},
];
