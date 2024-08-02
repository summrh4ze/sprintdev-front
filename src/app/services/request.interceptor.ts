import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { mergeMap } from 'rxjs';
import { environment } from '../../environments/environment';

export const requestInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const baseURL = environment.apiUrl;
  const keycloakService = inject(KeycloakService);
  return keycloakService.addTokenToHeader(req.headers).pipe(mergeMap(headersWithBearer => {
    const authReq = req.clone({
      url: `${baseURL}${req.url}`,
      headers: headersWithBearer
    });
    return next(authReq);
  }));
};
