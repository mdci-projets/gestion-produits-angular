import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);

    // 🛠️ Mock manuel de `localStorage`
    let store: Record<string, string> = {};

    spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });

    spyOn(window.localStorage, 'getItem').and.callFake((key: string) => store[key] || null);

    spyOn(window.localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });

    spyOn(window.localStorage, 'clear').and.callFake(() => {
      store = {};
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('✅ devrait stocker un token', () => {
    service.setItem('authToken', 'test-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', '"test-token"'); // ⚠️ JSON.stringify ajoute des guillemets
  });

  it('✅ devrait récupérer un token', () => {
    service.setItem('authToken', 'test-token');
    expect(service.getItem('authToken')).toBe('test-token');
  });

  it('✅ devrait supprimer un token', () => {
    service.setItem('authToken', 'test-token');
    service.removeItem('authToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(service.getItem('authToken')).toBeNull();
  });

  it('✅ devrait vider tout le stockage', () => {
    service.setItem('authToken', 'test-token');
    service.clearStorage();
    expect(localStorage.clear).toHaveBeenCalled();
    expect(service.getItem('authToken')).toBeNull();
  });
});
