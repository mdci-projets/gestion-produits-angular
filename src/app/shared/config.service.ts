import { Injectable } from '@angular/core';

interface Config {
  productsApiUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: Config = { productsApiUrl: '' };

  async loadConfig(): Promise<void> {
    console.time('loadConfig');
    try {
      const response = await fetch('/gestion-produits-angular/assets/config.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.config = await response.json();
      console.timeEnd('loadConfig');
      console.log('Config chargée :', this.config);
    } catch (error) {
      console.timeEnd('loadConfig');
      console.warn('⚠️ Impossible de charger config.json, utilisation de la valeur par défaut :', error);
      this.config = { productsApiUrl: 'http://localhost:8080' };
    }
  }

  get productsApiUrl(): string {
    return this.config.productsApiUrl || 'http://localhost:8080';
  }
}
