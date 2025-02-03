import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'storeToken']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: { returnUrl: '/' } } } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('✅ devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('✅ devrait appeler AuthService.login avec les bonnes informations', () => {
    authServiceMock.login.and.returnValue(of({ token: 'fake-jwt-token' }));

    component.credentials.username = 'admin';
    component.credentials.password = 'password';
    component.login();

    expect(authServiceMock.login).toHaveBeenCalledWith({ username: 'admin', password: 'password' });
  });

  it('✅ devrait stocker le token après connexion réussie', () => {
    authServiceMock.login.and.returnValue(of({ token: 'fake-jwt-token' }));
    component.login();
    expect(authServiceMock.storeToken).toHaveBeenCalledWith('fake-jwt-token');
  });

  it('✅ devrait afficher une erreur en cas d’échec de connexion', () => {
    spyOn(console, 'error'); // Empêcher l'affichage de l'erreur dans la console

    authServiceMock.login.and.returnValue(
      throwError(() => new Error('Invalid credentials')) // Simule une erreur
    );

    component.login();

    expect(component.error).toBe('Identifiants invalides'); // Vérifie que l'erreur est bien affichée
    expect(console.error).toHaveBeenCalled(); // Vérifie que l'erreur a été loggée
  });
});
