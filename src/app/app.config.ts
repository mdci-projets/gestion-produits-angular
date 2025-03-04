import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './shared/auth/auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorInterceptor } from './shared/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor, // Intercepteur d'authentification
        HttpErrorInterceptor, // Intercepteur de gestion des erreurs
      ])
    ),
    importProvidersFrom(MatSnackBarModule), // Module Angular Material pour les notifications
    provideNoopAnimations() // Désactivation des animations
  ]
};
