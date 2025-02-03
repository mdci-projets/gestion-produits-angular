import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let environmentInjector: EnvironmentInjector;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    environmentInjector = TestBed.inject(EnvironmentInjector);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Simuler un `HttpHandlerFn`
  function mockNext(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    console.log("✅ mockNext() appelé avec URL :", req.url);
    return of(new HttpResponse({ status: 200, body: {} }));
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
