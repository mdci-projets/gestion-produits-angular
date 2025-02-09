import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'products/edit/:id',
    renderMode: RenderMode.Client // ✅ Empêche le prerendering pour cette route
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
