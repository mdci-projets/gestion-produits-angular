import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // ✅ Ajouté !
import { AuthService } from './shared/auth/auth.service';
import { NotificationService } from './websocket/notification.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule, HttpClientTestingModule], // ✅ Ajout de `HttpClientTestingModule`
      providers: [AuthService, NotificationService], // ✅ Fournir les services nécessaires
    }).compileComponents();
  });

  it('✅ devrait créer l\'application', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`✅ devrait avoir le titre 'fronted-angular'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('fronted-angular');
  });

  it('✅ devrait afficher la barre de navigation', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('nav')).toBeTruthy();
    expect(compiled.querySelector('.logo')?.textContent).toContain('Accueil');
    expect(compiled.querySelector('.add-product-link')?.textContent).toContain('Ajouter un produit');
  });
});
