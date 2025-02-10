import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let environmentInjector: EnvironmentInjector;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    environmentInjector = TestBed.inject(EnvironmentInjector);
  });

  afterEach(() => {
    httpMock.verify();
  });

 // Simuler un `HttpHandlerFn`
  function mockNext<T>(req: HttpRequest<T>): Observable<HttpEvent<T>> {
    console.log("✅ mockNext() appelé avec URL :", req.url);
    return of(new HttpResponse<T>({ status: 200, body: null as unknown as T }));
  }

  // 🟢 Test : Ajout du token si AuthService retourne un token
  it('✅ devrait ajouter le token d’authentification au header Authorization', (done) => {
    authService.getToken.and.returnValue('fake-token');
    const req = new HttpRequest('GET', '/api/protected');

    runInInjectionContext(environmentInjector, () => {
      authInterceptor(req, (modifiedReq) => {
        // Simuler un retour de requête après interception
        expect(modifiedReq.headers.has('Authorization')).toBeTrue();
        expect(modifiedReq.headers.get('Authorization')).toBe('Bearer fake-token');
        return of(new HttpResponse({ status: 200, body: {} }));
      }).subscribe(() => {
        done();
      });
    });
  });


  // 🟢 Test : Ne pas ajouter de token si AuthService retourne null
  it('✅ ne devrait pas ajouter de token si AuthService retourne null', (done) => {
    authService.getToken.and.returnValue(null);
    const req = new HttpRequest('GET', '/api/protected');

    runInInjectionContext(environmentInjector, () => {
      authInterceptor(req, mockNext).subscribe(() => {
        expect(req.headers.has('Authorization')).toBeFalse();
        done();
      });
    });
  });

  // 🟢 Test : Ne pas intercepter les requêtes vers /login et /register
  it('✅ ne devrait pas intercepter les requêtes vers /login et /register', (done) => {
    const loginReq = new HttpRequest('GET', '/login');
    const registerReq = new HttpRequest('GET', '/register');

    runInInjectionContext(environmentInjector, () => {
      authInterceptor(loginReq, mockNext).subscribe(() => {
        expect(loginReq.headers.has('Authorization')).toBeFalse();
      });

      authInterceptor(registerReq, mockNext).subscribe(() => {
        expect(registerReq.headers.has('Authorization')).toBeFalse();
        done();
      });
    });
  });

});
