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
  private socketUrl: string; // WebSocket URL (Backend)
  private messages: NotificationMessage[] = [];
  private notificationsSubject = new BehaviorSubject<NotificationMessage[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private injector = inject(Injector);
  private isConnected = false; // Vérifie si STOMP est déjà connecté

  constructor() {
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

    const socket = new SockJS(this.socketUrl);

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000 // Tentative de reconnexion automatique
    });

    this.stompClient.onConnect = () => {
      this.isConnected = true;

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
    /* const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]); */
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
