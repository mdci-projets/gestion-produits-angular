import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from './websocket/notification/notification.component';
import { AuthService } from './shared/auth/auth.service';
import { NotificationService } from './websocket/notification.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fronted-angular';
  credentials = { username: '', password: '' };

  constructor(private authService: AuthService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Si l'utilisateur est déjà connecté, démarrer WebSocket immédiatement
    if (this.authService.getToken()) {
      console.log("🌍 L'utilisateur est connecté, tentative de reconnexion WebSocket...");

      if (!this.notificationService.socketIsConnected) {
        this.notificationService.connect();
      }      
    }
  }

  isAuthenticated() {
    return this.authService.isLoggedIn();
  }
}
