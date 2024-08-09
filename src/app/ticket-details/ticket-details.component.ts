import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { EMPTY, Observable, of, shareReplay } from 'rxjs';
import { Ticket, TicketEvent } from '../domain/ticket';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ticket-details',
  standalone: true,
  imports: [CommonModule, MarkdownModule, FormsModule],
  templateUrl: './ticket-details.component.html',
  styleUrl: './ticket-details.component.css'
})
export class TicketDetailsComponent {
  ticket: Observable<Ticket>;
  ticketContentEdit = false;
  ticketTitleEdit = false;
  ticketCommentAdd = false;
  commentEdit = "";

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly date: DatePipe,
    private readonly auth: AuthService
  ) {
    const ticketId = parseInt(this.route.snapshot.paramMap.get('ticketId') || '0');
    if (ticketId > 0) {
      this.ticket = http.get<Ticket>(`/tickets/${ticketId}`).pipe(shareReplay());
    } else {
      this.ticket = EMPTY;
    }
  }

  editTitle() {
    this.ticketTitleEdit = true;
  }

  saveTitle() {
    this.ticketTitleEdit = false;
    this.ticket.subscribe(t => {
      this.http.put<Ticket>(`/tickets/${t.id}`, { title: t.title }).subscribe(res => {
        this.ticket = of(res);
      });
    })
  }

  editContent() {
    this.ticketContentEdit = true;
  }

  saveContent() {
    this.ticketContentEdit = false;
    this.ticket.subscribe(t => {
      this.http.put<Ticket>(`/tickets/${t.id}`, { content: t.content }).subscribe(res => {
        this.ticket = of(res);
      });
    })
  }

  renderEvent(event: TicketEvent): string {
    let res = `${this.date.transform(event.creationTime, 'dd-MM-yyyy HH:mm')}`;
    switch (event.type) {
      case 'CREATE':
        res = res + " - Ticket created by ";
        break;
      case 'CONTENT_APPROVE':
        res = res + " - Ticket content approved by ";
        break;
      case 'CONTENT_APPROVE_FINAL':
        res = res + " - Ticket content finally approved by ";
        break;
      case 'TITLE_EDIT':
        res = res + " - Ticket title edited by ";
        break;
      case 'SIZE_VOTE':
        res = res + " - Ticket size voted by ";
        break;
      case 'SIZE_VOTE_FINAL':
        res = res + " - Ticket size decided by ";
        break;
      case 'CONTENT_EDIT':
        res = res + " - Ticket content edited by ";
        break;
      case 'SPRINT_CHANGE':
        res = res + " - Ticket sprint changed by ";
        break;
      case 'STATUS_CHANGE':
        res = res + " - Ticket status changed by ";
        break;
      case 'COMMENT_ADD':
        res = res + " - Ticket comment added by ";
        break;
      case 'ASSIGNEE_CHANGE':
        res = res + " - Ticket assignee changed by ";
        break;
    }
    res = res + `${event.author.firstName} ${event.author.lastName} `;
    return res;
  }

  addComment() {
    this.ticketCommentAdd = true;
  }

  saveComment() {
    this.ticketCommentAdd = false;
    if (this.commentEdit == "") return;
    this.ticket.subscribe(t => {
      this.auth.userInfo.subscribe(author => {
        const comments = [{ author, content: this.commentEdit, creationTime: new Date() }];
        this.http.put<Ticket>(`/tickets/${t.id}`, { comments }).subscribe(res => {
          this.ticket = of(res);
          this.commentEdit = "";
        });
      });
    });
  }
}
