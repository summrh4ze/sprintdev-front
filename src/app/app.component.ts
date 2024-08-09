import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInfo } from './domain/user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sprintdev-front';
  screenWidth: any;
  screenHeight: any;
  showMoreItems = false;

  constructor(private readonly auth: AuthService) { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  isAuthenticated() {
    return this.auth.authenticated;
  }

  logout() {
    this.auth.logout();
  }

  togglePopup() {
    this.showMoreItems = !this.showMoreItems;
  }

  getUserInfo(): Observable<UserInfo> {
    return this.auth.userInfo;
  }
}
