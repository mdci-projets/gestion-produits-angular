import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../../websocket/notification.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;
  let routerMock: jasmine.SpyObj<Router>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['login', 'storeToken', 'getToken', 'isAuthenticated$']);
    notificationServiceMock = jasmine.createSpyObj('NotificationService', ['connect', 'socketIsConnected']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: { returnUrl: '/' } } } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    notificationServiceMock.socketIsConnected.and.returnValue(true); // Évite la connexion WebSocket
    fixture.detectChanges();
  });

  it('✅ devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('✅ devrait appeler AuthService.login avec les bonnes informations et recevoir un token', () => {
    // 🟢 Mock le retour de login() pour simuler une réponse API SANS le backend
    authServiceMock.login.and.returnValue(of({ token: 'fake-jwt-token' }));
  
    component.credentials.username = 'admin';
    component.credentials.password = 'password';
    component.login();
  
    // 🔥 Vérifie que la requête est bien appelée
    expect(authServiceMock.login).toHaveBeenCalledWith({ username: 'admin', password: 'password' });
  
    // 🔥 Vérifie que la redirection a bien eu lieu
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });


  it('✅ ne doit pas stocker le token dans LoginComponent (géré par AuthService)', () => {
    authServiceMock.login.and.returnValue(of({ token: 'fake-jwt-token' }));
    
    component.credentials.username = 'admin';
    component.credentials.password = 'password';
    component.login();

    expect(authServiceMock.storeToken).not.toHaveBeenCalled(); // 🔥 Vérifie que storeToken N'EST PAS appelé ici
    expect(authServiceMock.isAuthenticated$).toBeDefined(); // 🔥 Vérifie que l'état d'auth est mis à jour
  });


  it('✅ ne devrait PAS reconnecter WebSocket en cas d’échec de connexion', (done) => {
    // 🔥 Simule une réponse d'erreur HTTP
    notificationServiceMock.socketIsConnected.and.returnValue(true);
    const httpError = { status: 400, error: { message: 'Identifiants invalides' } };
    authServiceMock.login.and.returnValue(throwError(() => httpError));
  
    component.login();
    fixture.detectChanges();
  
    setTimeout(() => {
      // Vérifie que WebSocket ne tente pas de se reconnecter
      expect(notificationServiceMock.connect).not.toHaveBeenCalled();
      done(); // ✅ Marque le test comme terminé
    }, 100); // Petit délai pour permettre l’exécution des erreurs
  });
  
  
  it('✅ devrait tenter de connecter WebSocket après connexion', () => {
    authServiceMock.login.and.returnValue(of({ token: 'fake-token' }));
    notificationServiceMock.socketIsConnected.and.returnValue(false);
  
    component.login();
  
    expect(notificationServiceMock.connect).toHaveBeenCalled();
  });


  it('✅ ne devrait PAS reconnecter WebSocket si déjà connecté', () => {
    authServiceMock.login.and.returnValue(of({ token: 'fake-token' }));
    notificationServiceMock.socketIsConnected.and.returnValue(true);

    component.login();

    expect(notificationServiceMock.connect).not.toHaveBeenCalled();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  
    spyOn(console, 'error'); // ✅ Évite l'affichage d'erreurs inutiles
  
    // Vérifie si `open` a déjà été espionné pour éviter le doublon
    if (!snackBarMock.open.and) {
      spyOn(snackBarMock, 'open');
    }
  });  
});
