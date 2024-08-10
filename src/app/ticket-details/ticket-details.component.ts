import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { combineLatest, EMPTY, map, mergeMap, Observable, Observer, of, shareReplay } from 'rxjs';
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
  selectedSize = "";
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
        res = res + " - Ticket size " + event.sizeVote + " voted by ";
        break;
      case 'SIZE_VOTE_FINAL':
        res = res + " - Ticket size " + event.sizeVote + " decided by ";
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
    res = res + (event.message || "")
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

  private getLastUpdateContentEvent(events: TicketEvent[]): TicketEvent {
    const filteredAndSorted = events
      .filter(e => e.type === "CREATE" || e.type === "CONTENT_EDIT")
      .sort((e1, e2) => {
        if (e1.creationTime < e2.creationTime) return -1;
        if (e1.creationTime === e2.creationTime) return 0;
        return 1;
      });
    return filteredAndSorted[filteredAndSorted.length - 1];
  }

  hasUserApproved(): Observable<boolean> {
    return combineLatest([this.auth.userInfo, this.ticket]).pipe(map(([u, t]) => {
      const last = this.getLastUpdateContentEvent(t.events);
      if (t.events.some(e =>
        e.author.id === u.id &&
        e.type === "CONTENT_APPROVE" &&
        e.creationTime > last.creationTime
      )) {
        return true;
      }
      return false;
    }));
  }

  hasUserVoted(): Observable<boolean> {
    return combineLatest([this.auth.userInfo, this.ticket]).pipe(map(([u, t]) => {
      if (t.events.some(e =>
        e.author.id === u.id &&
        e.type === "SIZE_VOTE"
      )) {
        return true;
      }
      return false;
    }));
  }

  approve() {
    const observer: Observer<Ticket> = {
      next: res => this.ticket = of(res),
      error: err => alert(err.error.message),
      complete: () => console.log("PUT /tickets/id/approve completed")
    }
    this.ticket.pipe(
      mergeMap(t => {
        console.log("calling PUT /tickets/id/approve");
        return this.http.put<Ticket>(`/tickets/${t.id}/approve`, {
          message: ""
        });
      }),
    ).subscribe(observer);
  }

  finalApprove() {
    const observer: Observer<Ticket> = {
      next: res => this.ticket = of(res),
      error: err => alert(err.error.message),
      complete: () => console.log("PUT /tickets/id/approveFinal completed")
    }
    this.ticket.pipe(
      mergeMap(t => {
        console.log("calling PUT /tickets/id/approveFinal");
        return this.http.put<Ticket>(`/tickets/${t.id}/approveFinal`, {
          message: ""
        });
      }),
    ).subscribe(observer);
  }

  voteSize() {
    const observer: Observer<Ticket> = {
      next: res => {
        this.ticket = of(res);
        this.selectedSize = "";
      },
      error: err => alert(err.error.message),
      complete: () => console.log("PUT /tickets/id/vote completed")
    }
    this.ticket.pipe(
      mergeMap(t => {
        console.log("calling PUT /tickets/id/vote");
        return this.http.put<Ticket>(`/tickets/${t.id}/vote`, {
          message: "",
          size: this.selectedSize
        });
      }),
    ).subscribe(observer);
  }

  finalVoteSize() {
    const observer: Observer<Ticket> = {
      next: res => {
        this.ticket = of(res);
        this.selectedSize = "";
      },
      error: err => alert(err.error.message),
      complete: () => console.log("PUT /tickets/id/voteFinal completed")
    }
    this.ticket.pipe(
      mergeMap(t => {
        console.log("calling PUT /tickets/id/voteFinal");
        return this.http.put<Ticket>(`/tickets/${t.id}/voteFinal`, {
          message: "",
          size: this.selectedSize
        });
      }),
    ).subscribe(observer);
  }

  canVote() {
    return this.selectedSize !== "";
  }

}
