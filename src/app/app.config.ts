import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './shared/auth/auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorInterceptor } from './shared/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers:
  [
      provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()),
      provideHttpClient(
         withInterceptors([
           authInterceptor, // Ajout de l'intercepteur
           HttpErrorInterceptor,  // Intercepteur pour la gestion des erreurs
         ])
      ),
      MatSnackBarModule, // Import du module pour les notifications
      provideNoopAnimations()
  ]
};
