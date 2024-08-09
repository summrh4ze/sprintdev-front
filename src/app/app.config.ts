import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { provideMarkdown } from 'ngx-markdown';
import { initKeycloak } from '../../init-keycloak';
import { routes } from './app.routes';
import { requestInterceptor } from './services/request.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    KeycloakService,
    provideHttpClient(withInterceptors([requestInterceptor])),
    provideMarkdown(),
    DatePipe
  ]
};
