import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth'; // Remplacez par l'URL de votre API
  private tokenKey = 'authToken'; // Clé pour stocker le token dans LocalStorage

  constructor(private http: HttpClient, private storageService: StorageService) {}

  // Méthode pour se connecter
  login(credentials: { username: string; password: string }): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
        catchError(() => of(null))
      );
  }

  storeToken(token: string): void {
    this.storageService.setItem(this.tokenKey, token); // Stocker le token
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
     const token = this.getToken();
     if (!token) return false;

     const payload = JSON.parse(atob(token.split('.')[1]));
     return payload.exp > Math.floor(Date.now() / 1000); // Vérifie l'expiration
  }

  getToken(): string | null {
      return this.storageService.getItem(this.tokenKey);
  }

  logout(): void {
     this.storageService.removeItem(this.tokenKey); // Supprime le token JWT
  }
}
