import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from './shared/auth/auth.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorInterceptor } from './shared/http-error.interceptor';
import { ConfigService } from './shared/config.service';
import { APP_INITIALIZER } from '@angular/core';

// Fonction d'initialisation de l'application
export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

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
    provideNoopAnimations(), // Désactivation des animations
    ConfigService, // Service de configuration
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    }
  ]
};
