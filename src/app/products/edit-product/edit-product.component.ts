import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../model/product';

@Component({
  selector: 'app-edit-product',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  product!: Product; // Le produit à éditer
  isLoading = true;  // Indicateur de chargement

  constructor(private route: ActivatedRoute, public router: Router, private productService: ProductService){}

  ngOnInit(): void {
    // Récupérer l'ID du produit à partir des paramètres de la route
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    if (productId) {
      this.loadProduct(productId);
    } else {
      console.error('ID du produit non trouvé.');
      this.router.navigate(['/products']);
    }
  }

 // Charger les détails du produit depuis le service
  loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du produit :', err);
        this.router.navigate(['/products']);
      }
    });
  }


 // Sauvegarder les modifications
  saveProduct(): void {
    this.productService.updateProduct(this.product.id, this.product).subscribe({
      next: () => {
        console.log('Produit mis à jour avec succès.');
        this.router.navigate(['/products']); // Retour à la liste des produits
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du produit :', err);
      }
    });
  }

}
