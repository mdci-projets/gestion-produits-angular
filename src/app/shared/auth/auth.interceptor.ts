import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

   const excludedRoutes = ['/login', '/register'];
    if (excludedRoutes.some((url) => req.url.includes(url))) {
      return next(req); // Ignorer l'intercepteur pour ces routes
    }

  // Récupérer le token via AuthService
  const token = authService.getToken();

  if (token) {
     req = req.clone({
       headers: req.headers.set('Authorization', `Bearer ${token}`),
     });
   } else {
     console.warn('Interceptor - No token found, request sent without Authorization');
   }

   return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.error('🚨 401 Unauthorized - Redirection vers /login');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};