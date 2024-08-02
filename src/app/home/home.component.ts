import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observer } from 'rxjs';
import { Ticket } from '../domain/ticket';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public tickets: Ticket[] = [];

  constructor(private readonly http: HttpClient, private readonly auth: AuthService) {
    let observer: Observer<Ticket[]> = {
      next: res => {
        console.log(res);
        this.tickets = res;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        console.log("call to /tickets is done");
      },
    }
    http.get<Ticket[]>("/tickets").subscribe(observer)
  }
}
