import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // ✅ Vérifie si le stockage est accessible uniquement côté client
      this.storage = this.getAvailableStorage();
    }
  }

  /**
   * 🛠️ Vérifie quel stockage est disponible (localStorage ou sessionStorage).
   */
  private getAvailableStorage(): Storage {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('__test__', 'test');
        localStorage.removeItem('__test__');
        return localStorage;
      }
    } catch (e) {
      console.warn('⚠️ localStorage non disponible, basculement vers sessionStorage.', e);
    }

    try {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('__test__', 'test');
        sessionStorage.removeItem('__test__');
        return sessionStorage;
      }
    } catch (e) {
      console.warn('⚠️ sessionStorage non disponible.', e);
    }

    console.error('❌ Aucun stockage disponible.');
    return null!;
  }

  /**
   * 💾 Enregistre une valeur dans le stockage.
   */
  setItem<T>(key: string, value: T): void {
    if (!this.storage) return;
    try {
      this.storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`❌ Erreur lors du stockage de ${key}:`, error);
    }
  }

  /**
   * 🔍 Récupère une valeur du stockage.
   */
  getItem<T>(key: string): T | null {
    if (!this.storage) return null;
    const item = this.storage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`❌ Erreur lors de la récupération de ${key}:`, error);
      return null;
    }
  }

  /**
   * 🗑️ Supprime un élément du stockage.
   */
  removeItem(key: string): void {
    if (!this.storage) return;
    this.storage.removeItem(key);
  }

  /**
   * 🧹 Supprime toutes les données stockées.
   */
  clearStorage(): void {
    if (!this.storage) return;
    this.storage.clear();
    console.warn('⚠️ Toutes les données de stockage ont été supprimées.');
  }
}
