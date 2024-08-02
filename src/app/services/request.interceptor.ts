import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { mergeMap } from 'rxjs';

export const requestInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const keycloakService = inject(KeycloakService);
  if (!keycloakService.enableBearerInterceptor) {
    return next(req);
  }
  return keycloakService.addTokenToHeader(req.headers).pipe(mergeMap(headersWithBearer => {
    const authReq = req.clone({ headers: headersWithBearer });
    return next(authReq);
  }));
};
