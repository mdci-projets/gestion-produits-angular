import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
//import { ConfigService } from './app/shared/config.service';

/* async function main() {
  const app = await bootstrapApplication(AppComponent, appConfig);
  const configService = app.injector.get(ConfigService);
  await configService.loadConfig(); // 🔥 Attendre le chargement de `config.json` avant de continuer
  console.log("Config chargée :", configService.getConfig());
}

main().catch(err => console.error(err)); */

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
