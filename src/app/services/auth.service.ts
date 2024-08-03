import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';
import { EMPTY, Observable } from 'rxjs';
import { UserInfo } from '../domain/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authenticated = false;
  public userInfo: Observable<UserInfo>;

  constructor(private readonly keycloak: KeycloakService, private readonly http: HttpClient) {
    this.authenticated = this.keycloak.isLoggedIn()
    if (this.authenticated) {
      this.userInfo = this.http.get<UserInfo>("/users/me");
    } else {
      this.userInfo = EMPTY;
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
}
