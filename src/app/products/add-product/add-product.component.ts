import { Component } from '@angular/core';
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
export class AddProductComponent {
  productForm: FormGroup;
  productCreated: Product | undefined = undefined;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]], // 2e argument : validateurs synchrones
      price: [0, [Validators.required, Validators.min(1)]],      // 2e argument : validateurs synchrones
      description: ['', [Validators.required, Validators.maxLength(200)]] // 2e argument : validateurs synchrones
    });
  }

  onSubmit(): void {
      if (this.productForm.invalid) {
        return;
      }

      this.productService.addProduct(this.productForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']); // Redirection après succès
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l’ajout du produit : ' + (err.message || 'Erreur inconnue');
        }
      });
    }
  }
