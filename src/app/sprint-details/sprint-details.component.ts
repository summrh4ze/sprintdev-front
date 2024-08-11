import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, from, map, mergeMap, Observable, shareReplay, toArray } from 'rxjs';
import { Sprint } from '../domain/project';
import { Ticket } from '../domain/ticket';

@Component({
  selector: 'app-sprint-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sprint-details.component.html',
  styleUrl: './sprint-details.component.css'
})
export class SprintDetailsComponent {
  projectId: number;
  sprintId: number;
  sprint: Observable<Sprint>;
  tickets: Observable<Ticket[]>;

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    this.projectId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.sprintId = parseInt(this.route.snapshot.paramMap.get('sprintId') || '0');
    if (this.projectId !== 0 && this.sprintId !== 0) {
      this.sprint = this.http.get<Sprint>(`/projects/${this.projectId}/sprints/${this.sprintId}`).pipe(shareReplay());
      this.tickets = this.sprint.pipe(
        mergeMap(sprint => {
          return from(sprint.ticketIds).pipe(
            mergeMap(id => this.http.get<Ticket>(`/tickets/${id}`))
          );
        }),
        toArray(),
        shareReplay()
      )
    } else {
      this.sprint = EMPTY;
      this.tickets = EMPTY;
    }
  }

  getReadyForDevTickets() {
    return this.tickets.pipe(map(tickets => tickets.filter(t => t.status === "DEV_READY")));
  }

  getInProgressTickets() {
    return this.tickets.pipe(map(tickets => tickets.filter(t => t.status === "IN_PROGRESS")));
  }

  getCodeReviewReadyTickets() {
    return this.tickets.pipe(map(tickets => tickets.filter(t => t.status === "CODE_REVIEW_READY")));
  }

  getQaReadyTickets() {
    return this.tickets.pipe(map(tickets => tickets.filter(t => t.status === "QA_READY")));
  }

  getReleaseReadyTickets() {
    return this.tickets.pipe(map(tickets => tickets.filter(t => t.status === "RELEASE_READY")));
  }

  getDoneTickets() {
    return this.tickets.pipe(map(tickets => tickets.filter(t => t.status === "DONE")));
  }

  getTicketLink(ticketId: number): string {
    return `/project/${this.projectId}/ticket/${ticketId}`;
  }
}
