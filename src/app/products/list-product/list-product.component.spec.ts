import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProductComponent } from './list-product.component';
import { ProductService } from '../product.service';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';

describe('ListProductComponent', () => {
  let component: ListProductComponent;
  let fixture: ComponentFixture<ListProductComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProduct']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ListProductComponent, MatTableModule, MatPaginatorModule], // Utilisation de imports[] au lieu de declarations[]
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { title: 'products' } } } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProductComponent);
    component = fixture.componentInstance;
  });

  it('✅ devrait charger les produits au démarrage', () => {
    const mockProducts = {
      content: [{ id: 1, name: 'Produit A', price: 100 }],
      totalElements: 1,
      totalPages: 1,
      size: 5,
      number: 0,
    };

    authServiceMock.isLoggedIn.and.returnValue(true);
    productServiceMock.getProducts.and.returnValue(of(mockProducts));

    fixture.detectChanges();

    expect(component.products.data.length).toBe(1);
    expect(component.products.data[0].name).toBe('Produit A');
  });
});
