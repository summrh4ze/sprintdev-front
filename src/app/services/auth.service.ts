import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';
import { Observable } from 'rxjs';
import { UserInfo } from '../domain/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authenticated = false
  public isUser = false
  public isAdmin = false

  constructor(private readonly keycloak: KeycloakService, private readonly http: HttpClient) {
    this.authenticated = this.keycloak.isLoggedIn()
    if (this.authenticated) {
      const roles = this.keycloak.getUserRoles();
      this.isUser = roles.includes('USER');
      this.isAdmin = roles.includes('ADMIN');
    }
  }

  login() {
    let keycloakLoginOptions: KeycloakLoginOptions = {
      redirectUri: "http://localhost:4200/home",
    }
    this.keycloak.login(keycloakLoginOptions);
  }

  logout() {
    this.keycloak.logout();
  }

  getUserInfo(): Observable<UserInfo> {
    return this.http.get<UserInfo>("/users/me");
  }
}
