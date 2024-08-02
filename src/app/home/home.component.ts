import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observer } from 'rxjs';
import { Ticket } from '../domain/ticket';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  //public accessToken: string = "";
  public tickets: Ticket[] = [];

  constructor(private readonly http: HttpClient, private readonly auth: AuthService) {
    let observer : Observer<Ticket[]> = {
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
    http.get<Ticket[]>("http://localhost:8080/tickets").subscribe(observer)
    // this.auth.getAccesToken().then(token => {
    //   this.accessToken = token;
    // }).catch(err => {
    //   console.log(err);
    // })
  }

  logout() {
    this.auth.logout()
  }
}
