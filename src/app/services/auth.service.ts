import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = ""
  public authenticated = false
  public isUser = false
  public isAdmin = false

  constructor(private readonly keycloak: KeycloakService) {
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

  async getAccesToken() : Promise<string> {
    let token = await this.keycloak.getToken();
    return token;
  }
}
