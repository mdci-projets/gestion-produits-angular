import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ConfigService } from './app/shared/config.service';

async function loadConfig(configService: ConfigService): Promise<void> {
  await configService.loadConfig();
}

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    const configService = appRef.injector.get(ConfigService);
    return loadConfig(configService);
  })
  .catch(err => console.error(err));

