import{Component}from'@angular/core';
import {Router, ActivatedRoute }from '@angular/router';
import { CommonModule}from '@angular/common';
import {FormsModule}from '@angular/forms';
import {MatFormFieldModule}from '@angular/material/form-field';
import {MatInputModule}from '@angular/material/input';
import {MatButtonModule}from '@angular/material/button';
import {AuthService}from '../auth.service';

@Component({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.css'],
imports: [
CommonModule,
FormsModule,
MatFormFieldModule,
MatInputModule,
MatButtonModule
]
})
export class LoginComponent {
credentials = { username: '', password: '' };
error: string | null = null;

constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
        ) {}

  login(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        if (response && response.token) {
          this.authService.storeToken(response.token);
          this.router.navigate([returnUrl]); // Redirige vers la page précédente ou l'accueil
        } else {
          this.error = 'Connexion échouée. Veuillez vérifier vos informations.';
        }
      },
      error: (err) => {
        this.error = 'Identifiants invalides';
        console.error(err);
      }
    });
  }
}

