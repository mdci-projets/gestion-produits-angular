import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let mockLocalStorage: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);

    // Mock de `localStorage`
    mockLocalStorage = {
      length: 0,
      getItem: jasmine.createSpy('getItem').and.callFake((key: string) => null),
      setItem: jasmine.createSpy('setItem').and.callFake((key: string, value: string) => {}),
      removeItem: jasmine.createSpy('removeItem').and.callFake((key: string) => {}),
      clear: jasmine.createSpy('clear').and.callFake(() => {}),
      key: jasmine.createSpy('key').and.callFake((index: number) => null)
    };

    spyOnProperty(window, 'localStorage', 'get').and.returnValue(mockLocalStorage);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('✅  devrait stocker un token', () => {
    service.setItem('authToken', 'test-token');
    expect(localStorage.setItem).toHaveBeenCalledWith('authToken', 'test-token');
  });

  it('✅  devrait récupérer un token', () => {
    localStorage.getItem = jasmine.createSpy('getItem').and.returnValue('test-token');
    expect(service.getItem('authToken')).toBe('test-token');
    expect(localStorage.getItem).toHaveBeenCalledWith('authToken');
  });

  it('✅  devrait supprimer un token', () => {
    service.removeItem('authToken');
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
  });
});
