import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from './model/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/products';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Mock HTTP
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête HTTP n'est en attente
  });

  // TEST 1: Récupérer une liste de produits avec pagination
  it('✅  devrait récupérer une liste paginée de produits', () => {
    const mockResponse = {
      content: [
        { id: 1, name: 'Produit A', price: 10 },
        { id: 2, name: 'Produit B', price: 20 },
      ],
      totalElements: 2,
      totalPages: 1,
      size: 10,
      number: 0 // Numéro de la page
    };

    service.getProducts(0, 10).subscribe((data) => {
      expect(data.content.length).toBe(2);
      expect(data.content).toEqual(mockResponse.content);
      expect(data.totalElements).toBe(2);
      expect(data.number).toBe(0); // Vérification de la page actuelle
    });

    const req = httpMock.expectOne('http://localhost:8080/api/products?page=0&size=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // TEST 2: Récupérer un produit par ID
  it('✅  devrait récupérer un produit par ID', () => {
    const mockProduct: Product = { id: 1, name: 'Produit Test', price: 50 };

    service.getProductById(1).subscribe((product) => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  // TEST 3: Ajouter un produit
  it('✅  devrait ajouter un produit', () => {
    const newProduct: Product = { id: 3, name: 'Produit C', price: 30 };

    service.addProduct(newProduct).subscribe((product) => {
      expect(product).toEqual(newProduct);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newProduct);
  });

  // ✅ TEST 4: Mettre à jour un produit
  it('✅  devrait mettre à jour un produit', () => {
    const updatedProduct: Product = { id: 1, name: 'Produit Modifié', price: 60 };

    service.updateProduct(1, updatedProduct).subscribe((product) => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  // TEST 5: Supprimer un produit
 it('✅  devrait supprimer un produit', () => {
   service.deleteProduct(1).subscribe((response) => {
     expect(response).toBeNull(); // ✅ Vérifier `null` au lieu de `undefined`
   });

   const req = httpMock.expectOne('http://localhost:8080/api/products/1');
   expect(req.request.method).toBe('DELETE');
   req.flush(null); // ✅ Réponse correcte
 });

  // TEST 6: Gestion d'erreur - Produit non trouvé (404)
  it('✅  devrait gérer une erreur 404', () => {
    service.getProductById(999).subscribe({
      next: () => fail('L’appel devrait échouer'),
      error: (error) => expect(error.status).toBe(404),
    });

    const req = httpMock.expectOne(`${baseUrl}/999`);
    req.flush('Erreur 404', { status: 404, statusText: 'Not Found' });
  });

  // TEST 7: Gestion d'erreur - Erreur serveur (500)
  it('✅  devrait gérer une erreur serveur 500', () => {
    service.getProducts(0, 10).subscribe({
      next: () => fail('L’appel devrait échouer'),
      error: (error) => expect(error.status).toBe(500),
    });

    const req = httpMock.expectOne(`${baseUrl}?page=0&size=10`);
    req.flush('Erreur 500', { status: 500, statusText: 'Internal Server Error' });
  });
});
