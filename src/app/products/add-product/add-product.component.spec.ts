import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock du ProductService
    productServiceMock = jasmine.createSpyObj('ProductService', ['addProduct']);
    // Mock du Router
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, AddProductComponent], // Modules nécessaires
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Déclenche le cycle de vie Angular
  });

  // ✅ Test 1 : Vérifier que le composant est créé
  it('✅ devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  // Test 2 : Vérifier que le formulaire est invalide au début
  it('✅ devrait avoir un formulaire invalide au début', () => {
    expect(component.productForm.valid).toBeFalsy();
  });

  // Test 3 : Vérifier que le formulaire devient valide après avoir saisi des valeurs correctes
  it('✅ devrait valider le formulaire avec des valeurs correctes', () => {
    component.productForm.setValue({
      name: 'Test Produit',
      price: 100,
      description: 'Un produit de test'
    });

    expect(component.productForm.valid).toBeTruthy();
  });

  // Test 4 : Vérifier l'ajout d'un produit avec succès
  it('✅ devrait appeler addProduct et rediriger après un ajout réussi', () => {
    const mockProduct = { id: 1, name: 'Produit Test', price: 100, description: 'Un produit test' };
    productServiceMock.addProduct.and.returnValue(of(mockProduct));

    component.productForm.setValue({
      name: 'Produit Test',
      price: 100,
      description: 'Un produit test'
    });

    component.onSubmit();

    expect(productServiceMock.addProduct).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'Produit Test',
      price: 100,
      description: 'Un produit test'
    }));

    expect(routerMock.navigate).toHaveBeenCalledWith(['/']); // Vérifie la redirection
  });

  // Test 5 : Vérifier la gestion des erreurs lors de l'ajout d'un produit
  it('✅ devrait afficher un message d\'erreur en cas d\'échec de l\'ajout', () => {
    productServiceMock.addProduct.and.returnValue(throwError(() => new Error('Erreur serveur')));

    component.productForm.setValue({
      name: 'Produit Test',
      price: 100,
      description: 'Un produit test'
    });

    component.onSubmit();
    fixture.detectChanges();  // Important pour mettre à jour l'affichage

    expect(component.errorMessage).toBeDefined(); // Vérifier si un message d'erreur existe
    expect(component.errorMessage).toContain('Erreur lors de l’ajout du produit'); // Vérifier le contenu du message
  });

});
