import {Component, OnInit} from'@angular/core';
import { ProductService } from '../product.service';
import { Product } from '../model/product';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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

displayedColumns: string[] = ['name', 'price', 'description']; // Colonnes affichées
products = new MatTableDataSource<Product>(); // Source de données pour la table
errorMessage: string = '';

constructor(private productService: ProductService) {}

   ngOnInit(): void {
    // Récupération des produits
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.data = data; // Associe les données au data source
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des produits :', err);
        this.errorMessage = 'Impossible de charger les produits.';
      }
    });
  }
}
