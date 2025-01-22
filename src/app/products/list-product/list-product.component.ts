import {Component, OnInit} from'@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../model/product';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth.service';

@Component({
selector: 'app-list-product',
imports: [
CommonModule,
HttpClientModule,
MatTableModule,
MatButtonModule,
MatIconModule
],
templateUrl: './list-product.component.html',
styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {

displayedColumns: string[] = ['name', 'price', 'description', 'actions']; // Colonnes affichées
products = new MatTableDataSource<Product>(); // Source de données pour la table
errorMessage: string = '';
isHomePage = false;

constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
) {}

   ngOnInit(): void {

   if (this.authService.isLoggedIn()) {
        // Vérifie si la page actuelle est l'accueil
        const page = this.route.snapshot.data['page'];
        this.isHomePage = page === 'home';
        // Récupération des produits
        this.loadProducts();
       } else {
         console.warn('User is not logged in. Products cannot be loaded.');
   }

  }

 // Charger les produits
  loadProducts(): void {
    this.productService.getProducts().subscribe({
            next: (data) => {
              this.products.data = data; // Associe les données au data source
            },
            error: (err) => {
              this.errorMessage = 'Impossible de charger les produits.';
            }
    });
  }

  // Modifier un produit
  onEdit(productId: number): void {
     this.router.navigate(['/products/edit', productId]);
  }

   // Supprimer un produit
    onDelete(id: number): void {
      if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts(); // Recharger la liste
          },
          error: (err) => {
            console.error('Erreur lors de la suppression du produit :', err);
          }
        });
      }
    }
}
