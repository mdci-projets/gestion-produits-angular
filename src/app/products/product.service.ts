import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './model/product';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private apiUrl = 'http://localhost:8080/api/products';

constructor(private http: HttpClient) {}

  // Méthode pour récupérer les produits
  getProducts(): Observable<Product[]> {
    // Retourne un Observable de type Product[] en effectuant une requête HTTP
    return this.http.get<Product[]>(this.apiUrl)
      .pipe(catchError((error) => {
        console.error('Erreur lors de la récupération des produits :', error);
        throw error;
        })
      );
  }

  // Méthode pour ajouter un produit
  addProduct(product: Product): Observable<Product> {
     return this.http.post<Product>(this.apiUrl, product);
  }

}
