import { Routes } from '@angular/router';
import { ListProductComponent } from './products/list-product/list-product.component';
import { AddProductComponent } from './products/add-product/add-product.component';

export const routes: Routes = [
  {
    path: '', component: ListProductComponent // Chemin de la page d'accueil
  },
  { path: 'add-product', component: AddProductComponent }
];
