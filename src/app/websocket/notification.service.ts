import { Injectable, inject, Injector } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../shared/auth/auth.service';
import { environment } from '../../environments/environment';

interface NotificationMessage {
  message: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private stompClient: Client | null = null;
  private socketUrl: string;
  private messages: NotificationMessage[] = [];
  private notificationsSubject = new BehaviorSubject<NotificationMessage[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private injector = inject(Injector);
  private isConnected = false; // Vérifie si STOMP est déjà connecté

  constructor() {
     //this.socketUrl = `${environment.productsApiUrl}/ws`;
    const protocol = environment.production ? 'https://' : 'http://';
    const domain = environment.production ? 'gestion-produits-backend.mdci-consulting.fr' : 'localhost:8080';
    this.socketUrl = `${protocol}${domain}/ws`;

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

    // Ajouter le token dans l'URL pour l'authentification
    // const socket = new SockJS(`${this.socketUrl}?token=${token}`);
    const socket = new SockJS(`${this.socketUrl}?token=${token}`);

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000, // Tentative de reconnexion automatique
      connectHeaders: {
         Authorization: `Bearer ${token}`,  // En-tête d'autorisation
      },
    });

    this.stompClient.onConnect = () => {
      this.isConnected = true;

      // Écoute des notifications WebSocket
      this.stompClient?.subscribe('/topic/products', (message: Message) => {
        const notification = JSON.parse(message.body).message;
        this.addNotification(notification);
      });

      console.log("✅ WebSocket STOMP connecté !");
    };

    this.stompClient.onStompError = (frame) => {
      console.error('❌ Erreur STOMP:', frame);
    };

    this.stompClient.activate();
  }

  private addNotification(notification: string): void {
    const newMessage: NotificationMessage = {
          message: notification,
          timestamp: new Date()
    };

    // Ajouter le message en début de liste et conserver les 5 derniers
    this.messages.unshift(newMessage);
    if (this.messages.length > 2) {
       this.messages.pop();
    }

    // Mettre à jour l'observable
    this.notificationsSubject.next([...this.messages]);
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
