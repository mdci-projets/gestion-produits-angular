import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, PaginatedResponse } from './model/product';
import { ConfigService } from '../shared/config.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private baseUrl: string;

constructor(private http: HttpClient, private configService: ConfigService) {
  this.baseUrl = `${this.configService.productsApiUrl}/api/products`;
}

  // Méthode pour récupérer les produits
  getProducts(page: number, size: number): Observable<PaginatedResponse<Product>> {
    // Retourne un Observable de type Product[] en effectuant une requête HTTP
    return this.http.get<PaginatedResponse<Product>>(`${this.baseUrl}?page=${page}&size=${size}`, { withCredentials: true });
  }

  // Méthode pour ajouter un produit
  addProduct(product: Product): Observable<Product> {
     return this.http.post<Product>(this.baseUrl, product);
  }

  // Récupérer un produit par ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

 // Modifier un produit
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  // Supprimer un produit
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
