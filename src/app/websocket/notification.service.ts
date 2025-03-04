import { Injectable, inject, Injector } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { ConfigService } from '../shared/config.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient: Client | null = null;
  private socketUrl: string; // WebSocket URL (Backend)
  private notificationsSubject = new BehaviorSubject<string[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private injector = inject(Injector);
  private isConnected = false; // Vérifie si STOMP est déjà connecté

  constructor(private configService: ConfigService) {
    this.socketUrl = `${environment.productsApiUrl}/ws`;
    // Vérifier le token et reconnecter STOMP après un rafraîchissement (F5)
    setTimeout(() => {
      this.autoReconnect();
    }, 100); // Laisser Angular initialiser les services avant d'exécuter
  }

  private autoReconnect() {
    if (!this.isConnected) {
      try {
        const authService = this.injector.get(AuthService);
        const token = authService.getToken();
  
        if (token) {
          console.log("🔄 Auto-reconnexion WebSocket STOMP après rafraîchissement !");
          this.connect();
        }
      } catch (_error) {
        void _error;
        console.warn("⚠️ Impossible d'auto-reconnecter WebSocket, l'injector est détruit.");
      }
    }
  }

  connect() {
    console.log("📡 Tentative réelle de connexion STOMP...");

    if (this.isConnected) {
      console.log("🔵 WebSocket STOMP est déjà actif, pas besoin de reconnecter.");
      return;
    }

    const authService = this.injector.get(AuthService);
    const token = authService.getToken();

    if (!token) {
      console.warn('⚠️ Aucun token JWT trouvé ! Connexion WebSocket annulée.');
      return;
    }

    console.log("✅ Token trouvé, activation du WebSocket STOMP...");

    const socket = new SockJS(this.socketUrl);
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => console.log(`STOMP Debug: ${str}`),
      reconnectDelay: 5000 // Tentative de reconnexion automatique
    });

    this.stompClient.onConnect = () => {
      console.log('✅ Connecté au WebSocket STOMP !');
      this.isConnected = true; // Marquer comme connecté

      // Écoute des notifications
      this.stompClient?.subscribe('/topic/products', (message: Message) => {
        const notification = JSON.parse(message.body).message;
        this.addNotification(notification);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ Erreur STOMP:', frame);
    };




    if (!this.stompClient) {
      console.error("❌ STOMP Client is not initialized.");
      return;
    }
  
    if (this.stompClient.active) {
      console.warn("⚠️ STOMP Client is already connected.");
      return;
    }

    this.stompClient.activate();
  }

  private addNotification(notification: string) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('🔌 Déconnecté de WebSocket');
      this.isConnected = false;
    }
  }

   socketIsConnected(): boolean {
    return this.isConnected;
  }
}
