import { HttpErrorInterceptor } from './http-error.interceptor';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { EnvironmentInjector } from '@angular/core';

describe('HttpErrorInterceptor', () => {
  let snackBar: MatSnackBar;
  let router: Router;
  let next: HttpHandlerFn;
  let request: HttpRequest<any>;
  let injector: EnvironmentInjector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MatSnackBar, Router]
    });

    // Récupération de l'injecteur Angular depuis TestBed
    injector = TestBed.inject(EnvironmentInjector);
    snackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);

    spyOn(snackBar, 'open');
    spyOn(router, 'navigate');

    next = jasmine.createSpy().and.returnValue(of({}));
    request = new HttpRequest('GET', '/test');
  });

  function runInterceptorWithError(errorResponse: any, done: any, expectedMessage: string, shouldNavigate = false) {
    injector.runInContext(() => {
      next = jasmine.createSpy().and.returnValue(throwError(() => errorResponse));

      HttpErrorInterceptor(request, next).subscribe({
        error: (err) => {
          expect(snackBar.open).toHaveBeenCalledWith(expectedMessage, 'Fermer', { duration: 5000 });

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

  it('✅ devrait afficher un message d\'erreur 404', (done) => {
    runInterceptorWithError({ status: 404 }, done, 'La ressource demandée est introuvable.');
  });

  it('✅ devrait afficher un message d\'erreur 500', (done) => {
    runInterceptorWithError({ status: 500 }, done, 'Erreur interne du serveur. Veuillez réessayer plus tard.');
  });

  it('✅ devrait afficher un message d\'erreur 403', (done) => {
    runInterceptorWithError({ status: 403 }, done, 'Vous n’êtes pas autorisé à accéder à cette ressource.');
  });

  it('✅ devrait rediriger vers /login en cas d\'erreur 401', (done) => {
    runInterceptorWithError({ status: 401 }, done, 'Votre session a expiré. Veuillez vous reconnecter.', true);
  });

  it('✅ devrait afficher un message générique pour une erreur inconnue', (done) => {
    runInterceptorWithError({}, done, 'Impossible de se connecter au serveur. Vérifiez votre connexion.');
  });

  it('✅ devrait propager correctement l\'erreur', (done) => {
    injector.runInContext(() => {
      const customError = { status: 400, error: { message: 'Requête invalide' } };
      next = jasmine.createSpy().and.returnValue(throwError(() => customError));

      HttpErrorInterceptor(request, next).subscribe({
        error: (err) => {
          expect(err.message).toBe('Requête invalide');
          done();
        }
      });
    });
  });

});
