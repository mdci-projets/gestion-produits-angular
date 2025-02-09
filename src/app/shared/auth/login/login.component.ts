import{Component}from'@angular/core';
import {Router, ActivatedRoute }from '@angular/router';
import { CommonModule}from '@angular/common';
import {FormsModule}from '@angular/forms';
import {MatFormFieldModule}from '@angular/material/form-field';
import {MatInputModule}from '@angular/material/input';
import {MatButtonModule}from '@angular/material/button';
import {AuthService}from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../websocket/notification.service';

@Component({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.css'],
imports: [
CommonModule,
FormsModule,
MatFormFieldModule,
MatInputModule,
MatButtonModule,
MatSnackBarModule
]
})
export class LoginComponent {
credentials = { username: '', password: '' };
error: string | null = null;

constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private snackBar: MatSnackBar
) {}

  login(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response && response.token) {
          if (!this.notificationService.socketIsConnected()) {
            this.notificationService.connect();
          }
          this.router.navigate([returnUrl]); 
          this.showSuccessMessage('Connexion réussie !');
        } 
      },
      error: (err) => {}
    });
  }
  
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
}

