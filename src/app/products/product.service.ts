import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, PaginatedResponse } from './model/product';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private apiUrl: string = environment.productsApiUrl;

constructor(private http: HttpClient) {}

  // Méthode pour récupérer les produits
  getProducts(page: number, size: number): Observable<PaginatedResponse<Product>> {
    // Retourne un Observable de type Product[] en effectuant une requête HTTP
    return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}/api/products?page=${page}&size=${size}`);
  }

  // Méthode pour ajouter un produit
  addProduct(product: Product): Observable<Product> {
     return this.http.post<Product>(`${this.apiUrl}/api/products`, product);
  }

  // Récupérer un produit par ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/api/products/${id}`);
  }

 // Modifier un produit
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/api/products/${id}`, product);
  }

  // Supprimer un produit
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/products/${id}`);
  }

}
