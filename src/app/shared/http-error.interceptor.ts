import { HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const HttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'Une erreur inattendue s’est produite.';

      if (error.status !== undefined) {
        switch (error.status) {
          case 404:
            errorMessage = 'La ressource demandée est introuvable.';
            break;
          case 500:
            errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
            break;
          case 403:
            errorMessage = 'Vous n’êtes pas autorisé à accéder à cette ressource.';
            break;
          case 401:
            errorMessage = 'Votre session a expiré. Veuillez vous reconnecter.';
            router.navigate(['/login']);
            break;
          default:
            errorMessage = error.error?.message || errorMessage;
        }
      } else {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
      }

      snackBar.open(errorMessage, 'Fermer', { duration: 5000 });

      return throwError(() => new Error(errorMessage)); // S'assurer que l'erreur est bien propagée
    })
  );
};
