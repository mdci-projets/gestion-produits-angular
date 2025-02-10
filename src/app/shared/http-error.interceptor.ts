import { HttpInterceptorFn } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth/auth.service';

export const HttpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      let errorMessage = error.error?.message || 'Une erreur inattendue s’est produite.';
      let panelClass = 'error-snackbar'; // Style par défaut

      // Vérification explicite des erreurs réseau
      if (error.status === 0) {
        errorMessage = '🌍 Connexion impossible. Vérifiez votre réseau.';
        panelClass = 'network-snackbar';
      } else if (error.status !== undefined) {
        switch (error.status) {
          case 400:
            errorMessage = errorMessage = error.error?.message || '⚠️ Requête invalide. Vérifiez les informations saisies.';
            panelClass = 'warning-snackbar';
            break;
          case 401:
            errorMessage = '🔒 Session expirée. Veuillez vous reconnecter.';
            panelClass = 'auth-snackbar';
            authService.logout();
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = '⛔ Accès refusé ! Vous n’êtes pas autorisé.';
            panelClass = 'auth-snackbar';
            break;
          case 404:
            errorMessage = '❌ Ressource introuvable.';
            panelClass = 'error-snackbar';
            break;
          case 500:
            errorMessage = '💥 Erreur serveur. Veuillez réessayer plus tard.';
            panelClass = 'error-snackbar';
            break;
          default:
            errorMessage = error.error?.message || errorMessage;
            panelClass = 'error-snackbar';
        }
      } else {
        errorMessage = '🌍 Connexion impossible. Vérifiez votre réseau.';
        panelClass = 'network-snackbar';
      }

      // 🔥 Affichage du SnackBar avec styles améliorés
      snackBar.open(errorMessage, 'FERMER', {
        duration: 6000, // ⏳ Augmente la durée pour laisser le temps de lire
        horizontalPosition: 'center', // 🖥️ Centre l'affichage
        verticalPosition: 'top', // 📌 En haut de l'écran
        panelClass: panelClass // 🎨 Applique la classe CSS spécifique
      });

      return throwError(() => new Error(errorMessage));
    })
  );
};
