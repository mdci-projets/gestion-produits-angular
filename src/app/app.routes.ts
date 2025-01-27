import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products/list-product/list-product.component').then(
         (m) => m.ListProductComponent
      ),
      data: { page: 'home' }, // Indique que c'est l'accueil
      canActivate: [AuthGuard] // Protection avec AuthGuard
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/list-product/list-product.component').then(
        (m) => m.ListProductComponent
      ),
      data: { page: 'products' }, // Indique que c'est la liste des produits
      canActivate: [AuthGuard]
  },
  {
    path: 'add-product',
    loadComponent: () =>
      import('./products/add-product/add-product.component').then(
      (m) => m.AddProductComponent
    ),
    canActivate: [AuthGuard] // Protection avec le route guard
  },
  {
    path: 'products/edit/:id',
    loadComponent: () =>
      import('./products/edit-product/edit-product.component').then(
      (m) => m.EditProductComponent
    ),
    canActivate: [AuthGuard] // Protection avec le route guard
  },
  {
      path: 'login',
      component: LoginComponent
  },
  {
    path: '**', // Redirection pour les routes non trouvées
    redirectTo: ''
  }
];
