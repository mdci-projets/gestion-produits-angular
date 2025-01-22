import { Routes } from '@angular/router';
import { ListProductComponent } from './products/list-product/list-product.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
      path: '',
      component: ListProductComponent, // Chemin de la page d'accueil
      data: { page: 'home' }, // Indique que c'est l'accueil
      canActivate: [AuthGuard] // Protection avec AuthGuard
  },
  {
    path: 'products',
    component: ListProductComponent, // Chemin de la page d'accueil
    data: { page: 'products' }, // Indique que c'est la liste des produits
    canActivate: [AuthGuard]
  },
  {
    path: 'add-product',
    component: AddProductComponent,
    canActivate: [AuthGuard] // Protection avec le route guard
  },
  {
    path: 'products/edit/:id',
    component: EditProductComponent, // Route pour modifier un produit
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
