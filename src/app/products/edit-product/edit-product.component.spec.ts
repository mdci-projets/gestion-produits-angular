import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProductComponent } from './edit-product.component';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../model/product';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProductById', 'updateProduct']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        EditProductComponent
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
  });

  it('✅ devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('✅ devrait charger un produit à l’initiation', () => {
    const mockProduct = { id: 1, name: 'Produit Test', price: 100, description: 'Un super produit' };
    productServiceMock.getProductById.and.returnValue(of(mockProduct));

    component.ngOnInit();

    expect(component.product).toEqual(mockProduct);
    expect(component.isLoading).toBeFalse();
  });

 it('✅ devrait rediriger vers /products si le produit est introuvable', () => {
   spyOn(console, 'error'); // Empêcher l'affichage de l'erreur dans la console

   productServiceMock.getProductById.and.returnValue(
     throwError(() => new Error('Produit non trouvé')) // Simule une erreur
   );

   component.ngOnInit();

   expect(routerMock.navigate).toHaveBeenCalledWith(['/products']); // Vérifie la redirection
   expect(console.error).toHaveBeenCalledWith('Erreur lors du chargement du produit :', jasmine.any(Error));
 });

 it('✅ devrait sauvegarder les modifications et rediriger', () => {
   const updatedProduct: Product = { id: 1, name: 'Produit Test', price: 100, description: 'Un super produit' };

   component.product = updatedProduct;
   productServiceMock.updateProduct.and.returnValue(of(updatedProduct)); // Correction ici ✅

   component.saveProduct();

   expect(productServiceMock.updateProduct).toHaveBeenCalledWith(1, component.product);
   expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
 });

  it('✅ devrait afficher une erreur si la mise à jour échoue', () => {
    spyOn(console, 'error');
    component.product = { id: 1, name: 'Produit Test', price: 100, description: 'Un super produit' };
    productServiceMock.updateProduct.and.returnValue(throwError(() => new Error('Erreur de mise à jour')));

    component.saveProduct();

    expect(console.error).toHaveBeenCalledWith('Erreur lors de la mise à jour du produit :', jasmine.any(Error));
  });
});
