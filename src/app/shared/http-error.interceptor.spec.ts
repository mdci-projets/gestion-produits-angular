import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EnvironmentInjector } from '@angular/core';
import { AuthService } from '../shared/auth/auth.service';

describe('HttpErrorInterceptor', () => {
  let snackBar: MatSnackBar;
  let router: Router;
  let next: HttpHandlerFn;
  let request: HttpRequest<any>;
  let injector: EnvironmentInjector;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MatSnackBar,
        Router,
        { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['logout']) }
      ]
    });

    injector = TestBed.inject(EnvironmentInjector);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    spyOn(snackBar, 'open');
    spyOn(router, 'navigate');

    next = jasmine.createSpy().and.returnValue(of({}));
    request = new HttpRequest('GET', '/test');
  });

  function runInterceptorWithError(errorResponse: any, done: any, expectedMessage: string, expectedClass: string, shouldNavigate = false) {
    injector.runInContext(() => {
      next = jasmine.createSpy().and.returnValue(throwError(() => errorResponse));

      HttpErrorInterceptor(request, next).subscribe({
        error: (err) => {
          // ✅ Vérifie que le `snackBar` a été appelé avec le bon message et la bonne classe CSS
          expect(snackBar.open).toHaveBeenCalledWith(expectedMessage, 'FERMER', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: expectedClass
          });

          if (shouldNavigate) {
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
          } else {
            expect(router.navigate).not.toHaveBeenCalled();
          }

          expect(err.message).toBe(expectedMessage);
          done();
        }
      });
    });
  }

  it('✅ devrait afficher un message d\'erreur 400 avec `warning-snackbar`', (done) => {
    runInterceptorWithError({ status: 400 }, done, '⚠️ Requête invalide. Vérifiez les informations saisies.', 'warning-snackbar');
  });

  it('✅ devrait afficher un message d\'erreur 401 avec `auth-snackbar` et rediriger', (done) => {
    runInterceptorWithError({ status: 401 }, done, '🔒 Session expirée. Veuillez vous reconnecter.', 'auth-snackbar', true);
    expect(authService.logout).toHaveBeenCalled();
  });

  it('✅ devrait afficher un message d\'erreur 403 avec `auth-snackbar`', (done) => {
    runInterceptorWithError({ status: 403 }, done, '⛔ Accès refusé ! Vous n’êtes pas autorisé.', 'auth-snackbar');
  });

  it('✅ devrait afficher un message d\'erreur 404 avec `error-snackbar`', (done) => {
    runInterceptorWithError({ status: 404 }, done, '❌ Ressource introuvable.', 'error-snackbar');
  });

  it('✅ devrait afficher un message d\'erreur 500 avec `error-snackbar`', (done) => {
    runInterceptorWithError({ status: 500 }, done, '💥 Erreur serveur. Veuillez réessayer plus tard.', 'error-snackbar');
  });

  it('✅ devrait afficher un message de connexion impossible avec `network-snackbar`', (done) => {
    runInterceptorWithError({}, done, '🌍 Connexion impossible. Vérifiez votre réseau.', 'network-snackbar');
  });

  it('✅ devrait gérer une erreur avec un message personnalisé', (done) => {
    const customError = { status: 400, error: { message: 'Erreur spécifique' } };
    runInterceptorWithError(customError, done, 'Erreur spécifique', 'warning-snackbar');
  });
  
});
