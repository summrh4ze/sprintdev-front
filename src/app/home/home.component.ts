import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../domain/ticket';
import { UserInfo } from '../domain/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public tickets: Observable<Ticket[]>;

  constructor(private readonly http: HttpClient, private readonly auth: AuthService) {
    this.tickets = this.http.get<Ticket[]>("/tickets");
  }

  getUserInfo(): Observable<UserInfo> {
    return this.auth.userInfo;
  }
}
