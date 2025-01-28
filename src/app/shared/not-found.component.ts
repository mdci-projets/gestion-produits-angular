import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div style="text-align: center; margin-top: 50px;">
      <h1>404 - Page non trouvée</h1>
      <p>La page que vous cherchez est introuvable.</p>
      <a routerLink="/">Retour à l’accueil</a>
    </div>
  `,
})
export class NotFoundComponent {}
