import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('✅  devrait permettre l’accès si l’utilisateur est authentifié', () => {
    authServiceMock.isLoggedIn.and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
  });

  it('✅  devrait bloquer l’accès et rediriger vers login si l’utilisateur n’est pas authentifié', () => {
    authServiceMock.isLoggedIn.and.returnValue(false);
    expect(guard.canActivate()).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
