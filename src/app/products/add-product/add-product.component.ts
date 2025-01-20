import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';
import { Product } from '../model/product';

@Component({
  selector: 'app-add-product',
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  productCreated: Product | undefined = undefined;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // 2e argument : validateurs synchrones
      price: [0, [Validators.required, Validators.min(1)]],      // 2e argument : validateurs synchrones
      description: ['', [Validators.required, Validators.maxLength(200)]] // 2e argument : validateurs synchrones
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const newProduct: Product = this.productForm.value;
      this.productService.addProduct(newProduct).subscribe({
        next: (response) => {
          console.log('Produit ajouté avec succès :', response);
          alert('Produit ajouté avec succès !');
          this.productCreated = response;
          this.productForm.reset();
          this.router.navigate(['/']); // Redirection vers la page d'accueil
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du produit :', err);
          alert('Une erreur est survenue lors de l\'ajout du produit.');
        }
      });
    }
  }
}
