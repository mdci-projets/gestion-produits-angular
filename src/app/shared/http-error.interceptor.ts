import { HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators'; // Import pour gérer les erreurs
import { throwError } from 'rxjs'; // Import pour relancer une erreur
import { AuthService } from './auth/auth.service';

export const HttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
      catchError((error) => {
        let errorMessage = 'Une erreur inattendue s’est produite.';
        switch (error.status) {
          case 401:
            errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
            authService.logout();
            router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
            break;
          case 403:
            errorMessage = 'Vous n’êtes pas autorisé à accéder à cette ressource.';
            break;
          case 404:
            errorMessage = 'La ressource demandée est introuvable.';
            break;
          case 500:
            errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
            break;
          default:
            console.error('Erreur HTTP', error);
        }

        // Affiche le message d'erreur via MatSnackBar
        snackBar.open(errorMessage, 'Fermer', {
          duration: 5000,
        });
        return throwError(() => error);
      })
    );
  };
