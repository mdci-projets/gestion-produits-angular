import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { AuthService } from '../shared/auth/auth.service';
import { ConfigService } from '../shared/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

// ✅ 1️⃣ Mock du STOMP Client
class MockStompClient {
    onConnect: (() => void) | undefined;
    onStompError: (() => void) | undefined;
    activate = jasmine.createSpy('activate').and.callFake(() => {
      console.log("🟢 Mock STOMP Client: `activate()` appelé !");
      setTimeout(() => {
        if (this.onConnect) this.onConnect(); // Simule une connexion réussie
      }, 10);
    });
    deactivate = jasmine.createSpy('deactivate');
    subscribe = jasmine.createSpy('subscribe').and.returnValue({ unsubscribe: jasmine.createSpy() });
    publish = jasmine.createSpy('publish');
}

// ✅ 2️⃣ Mock AuthService
class MockAuthService {
  getToken = jasmine.createSpy('getToken').and.returnValue('fake-token');
}

describe('NotificationService', () => {
  let service: NotificationService;
  let authService: MockAuthService;
  let mockStompClient: MockStompClient;

  beforeEach(() => {
    mockStompClient = new MockStompClient();
    authService = new MockAuthService();

    spyOn(console, 'log'); // ✅ Évite les logs polluants
    spyOn(console, 'warn');
    spyOn(console, 'error');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // ✅ Ajout pour fournir `HttpClient`
      providers: [
        NotificationService,
        ConfigService, // ✅ Ajout du ConfigService
        { provide: AuthService, useValue: authService },
      ]
    });

    service = TestBed.inject(NotificationService);

    // Remplace le stompClient par le mock
    (service as unknown as { stompClient: typeof mockStompClient }).stompClient = mockStompClient;
  });

  it('🚨 ne doit pas activer WebSocket si déjà connecté', () => {
    (service as unknown as { isConnected: boolean }).isConnected = true; // Simule un WebSocket actif
    service.connect();

    expect(mockStompClient.activate).not.toHaveBeenCalled(); // ❌ Vérifie que `activate()` n'est PAS appelé
    expect(console.log).toHaveBeenCalledWith("🔵 WebSocket STOMP est déjà actif, pas besoin de reconnecter.");
  });

  it('✅ devrait retourner vrai si le WebSocket est connecté', () => {
    (service as unknown as { isConnected: boolean }).isConnected = true; // Force la connexion
    expect(service.socketIsConnected()).toBeTrue(); // Vérifie que la connexion est bien active
  });

  it('✅ devrait se déconnecter correctement', () => {
    service.disconnect();
    expect(mockStompClient.deactivate).toHaveBeenCalled(); // Vérifie l'appel à la déconnexion
    expect(service.socketIsConnected()).toBeFalse(); // Vérifie que l'état est bien `false`
  });
});
