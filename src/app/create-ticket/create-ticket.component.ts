import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { Observer } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [FormsModule, MarkdownModule],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css'
})
export class CreateTicketComponent {
  projectId: number;
  ticketTitle: string = "";
  ticketContent: string = "";
  ticketContentPreview = false;

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly auth: AuthService
  ) {
    this.projectId = parseInt(this.route.snapshot.paramMap.get("id") || "0");
  }

  handleSubmit() {
    const observer: Observer<any> = {
      next: res => this.router.navigate([`project/${this.projectId}/backlog`]),
      error: err => console.error(err),
      complete: () => console.log("POST /tickets complete")
    };
    this.auth.userInfo.subscribe(userInfo => {
      this.http.post("/tickets", {
        project: {
          id: this.projectId,
        },
        author: {
          id: userInfo.id,
        },
        title: this.ticketTitle,
        content: this.ticketContent,
      }).subscribe(observer);
    });
  }

  canSubmit() {
    return this.ticketTitle !== "" && this.ticketContent !== "";
  }

  toggleContentPreview() {
    this.ticketContentPreview = !this.ticketContentPreview;
  }

}
