import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StorageService } from './storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    // Création d'un mock de StorageService
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

  it('✅ devrait envoyer une requête POST lors de la connexion et retourner un token mocké', () => {
    const credentials = { username: 'testuser', password: 'password' };
    const mockResponse = { token: 'mocked.jwt.token' };
  
    // 🟢 Mock la requête `/auth/login` avec un faux retour (évite l'appel backend)
    service.login(credentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
  
    // 🔥 Vérifie que la requête a été envoyée correctement
    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(credentials);
  
    // ✅ Simule la réponse API (évite le backend)
    req.flush(mockResponse);
  });


  it('✅ devrait retourner une erreur "Identifiants invalides" en cas d\'échec de connexion', () => {
    const credentials = { username: 'testuser', password: 'password' };
  
    service.login(credentials).subscribe({
      error: (err) => {
        expect(err.message).toBe('Identifiants invalides');
      }
    });
  
    const req = httpMock.expectOne('http://localhost:8080/auth/login');
    req.error(new ErrorEvent('Invalid credentials')); // Simule une erreur API
  });
  

  it('✅ devrait stocker le token correctement', () => {
    const token = 'mocked.jwt.token';
    service.storeToken(token);
    
    expect(storageServiceSpy.setItem).toHaveBeenCalledWith('authToken', { token: 'mocked.jwt.token'});
  });

  it('✅ devrait récupérer le token depuis StorageService', () => {
    storageServiceSpy.getItem.and.returnValue({ token: 'mocked.jwt.token'});
    expect(service.getToken()).toBe('mocked.jwt.token');
  });

  it('✅ devrait retourner false si aucun token n\'est présent', () => {
    storageServiceSpy.getItem.and.returnValue(null);
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('✅ devrait retourner false si le token est expiré', () => {
    const expiredToken = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 100 })); // Token expiré
    storageServiceSpy.getItem.and.returnValue(JSON.parse(JSON.stringify({ token: expiredToken })));  
    expect(service.isLoggedIn()).toBeFalse();
  });
   
  it('✅ devrait retourner true si le token est valide', () => {
    const validToken = `${btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))}.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600, sub: "test-user" }))}.fake-signature`;
    storageServiceSpy.getItem.and.returnValue(JSON.parse(JSON.stringify({ token: validToken })));  
    expect(service.isLoggedIn()).toBeTrue();
  });  
  

  it('✅ devrait supprimer le token lors de l\'appel de logout()', () => {
    service.logout();
    expect(storageServiceSpy.removeItem).toHaveBeenCalledWith('authToken');
  });
});
