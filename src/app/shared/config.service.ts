import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

interface Config {
  productsApiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Config = { productsApiUrl: '' };  // Stocke la configuration
  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      this.config = await lastValueFrom(this.http.get<Config>('/assets/config.json'));
      console.log('✅ Config chargée :', this.config);
    } catch (error) {
      console.warn('⚠️ Impossible de charger config.json, utilisation de la valeur par défaut :', error);
      this.config = { productsApiUrl: 'http://localhost:8080' };
    }
  }

  getConfig(): Config {
    return this.config;
  }

  get productsApiUrl(): string {
    return this.config.productsApiUrl || 'http://localhost:8080';
  }
}
