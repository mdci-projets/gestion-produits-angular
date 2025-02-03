import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StorageService } from './storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    // Mock de StorageService
    const storageSpy = jasmine.createSpyObj('StorageService', ['setItem', 'getItem', 'removeItem']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Simule les requêtes HTTP
      providers: [
        AuthService,
        { provide: StorageService, useValue: storageSpy } // Injection du mock
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête HTTP restante n'est en attente
  });

  it('✅ devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('✅ devrait envoyer une requête POST lors de la connexion', () => {
    const credentials = { username: 'testuser', password: 'password' };
    const mockResponse = { token: 'mocked.jwt.token' };

    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
    req.flush(mockResponse);
  });

  it('✅ devrait retourner null en cas d\'erreur de connexion', () => {
    const credentials = { username: 'testuser', password: 'password' };

    service.login(credentials).subscribe(response => {
      expect(response).toBeNull(); // L'Observable retourne `null` en cas d'erreur
    });

    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    req.error(new ErrorEvent('Network error')); // Simule une erreur réseau
  });

  it('✅ devrait stocker le token lors de l\'appel de storeToken()', () => {
    const token = 'mocked.jwt.token';
    service.storeToken(token);
    expect(storageServiceSpy.setItem).toHaveBeenCalledWith('authToken', token);
  });

  it('✅ devrait récupérer le token depuis StorageService', () => {
    storageServiceSpy.getItem.and.returnValue('mocked.jwt.token');
    expect(service.getToken()).toBe('mocked.jwt.token');
  });

  it('✅ devrait retourner false si aucun token n\'est présent', () => {
    storageServiceSpy.getItem.and.returnValue(null);
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('✅ devrait retourner false si le token est expiré', () => {
    const expiredToken = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 100 })); // Token expiré
    storageServiceSpy.getItem.and.returnValue(`header.${expiredToken}.signature`);
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('✅ devrait retourner true si le token est valide', () => {
    const validToken = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })); // Expire dans 1h
    storageServiceSpy.getItem.and.returnValue(`header.${validToken}.signature`);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('✅ devrait supprimer le token lors de l\'appel de logout()', () => {
    service.logout();
    expect(storageServiceSpy.removeItem).toHaveBeenCalledWith('authToken');
  });
});
