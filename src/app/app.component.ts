import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observer } from 'rxjs';
import { UserInfo } from './domain/user';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sprintdev-front';
  userInfo: UserInfo | undefined;
  screenWidth: any;
  screenHeight: any;
  showMoreItems = false;

  constructor(private readonly auth: AuthService) {
    this.getUserInfo();
  }

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

  getUserInfo() {
    const observer: Observer<UserInfo> = {
      next: user => {
        this.userInfo = user;
      },
      error: err => console.error(err),
      complete: () => console.log("call to /users/me is done"),
    }
    this.auth.getUserInfo().subscribe(observer);
  }

  togglePopup() {
    this.showMoreItems = !this.showMoreItems;
  }
}
