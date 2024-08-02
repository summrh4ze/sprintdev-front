import {KeycloakService} from 'keycloak-angular';

export const initKeycloak = (keycloak: KeycloakService) => {
  return () => keycloak.init({
    config: {
      url: 'http://localhost:28080',
      realm: 'sprintdev',
      clientId: 'angular-app-client',
    },
    initOptions: {
      onLoad: 'check-sso',
      checkLoginIframe: false,
    },
    enableBearerInterceptor: true,
    bearerPrefix: 'Bearer',
  });
}