import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private tokenKey = 'authToken';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) {
    if (typeof window !== 'undefined') {
      this.refreshAuthState(); // ✅ Vérifie l'authentification uniquement côté client
    }
  }

  /**
   * 🔑 Connexion de l'utilisateur
   */
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response && response.token) {
          this.storeToken(response.token);
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => {
        console.error('❌ Échec de connexion:', error);
        return of(null);
      })
    );
  }

  /**
   * 📌 Stocke le token JWT
   */
  storeToken(token: string): void {
    if (typeof window !== 'undefined') {
      this.storageService.setItem(this.tokenKey, { token });
      this.isAuthenticatedSubject.next(true);
    }
  }

  /**
   * 🔍 Vérifie si l'utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return this.hasValidToken();
  }

  /**
   * 📤 Récupère le token JWT
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null; // ✅ Empêche les erreurs côté serveur

    const userToken = this.storageService.getItem<{ token: string }>(this.tokenKey);
    return userToken?.token || null;
  }

  /**
   * 🚪 Déconnexion de l'utilisateur
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      this.storageService.removeItem(this.tokenKey);
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
    }
  }

  /**
   * ⏳ Vérifie si le token est valide
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error('❌ Erreur lors du décodage du JWT:', error);
      return false;
    }
  }

  /**
   * 🔄 Rafraîchit l'état d'authentification au démarrage
   */
  private refreshAuthState(): void {
    this.isAuthenticatedSubject.next(this.hasValidToken());
  }
}
