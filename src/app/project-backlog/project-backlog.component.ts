import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { Ticket } from '../domain/ticket';

@Component({
  selector: 'app-project-backlog',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-backlog.component.html',
  styleUrl: './project-backlog.component.css'
})
export class ProjectBacklogComponent {
  projectId: number;
  createTicketRoute: string;
  tickets: Observable<Ticket[]>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly http: HttpClient
  ) {
    this.projectId = parseInt(this.route.snapshot.paramMap.get("id") || "0");
    this.tickets = this.http.get<Ticket[]>(`/tickets?projectId=${this.projectId}`).pipe(shareReplay());
    this.createTicketRoute = `/project/${this.projectId}/create-ticket`;
  }

  getReadyForSprintTickets(): Observable<Ticket[]> {
    return this.tickets.pipe(map(tickets => tickets.filter(t => t.status === "SPRINT_READY")));
  }

  getReadyForEstimationTickets(): Observable<Ticket[]> {
    return this.tickets.pipe(map(tickets => tickets.filter(t => t.status === "ESTIMATION_READY")));
  }

  getCreatedTickets(): Observable<Ticket[]> {
    return this.tickets.pipe(map(tickets => tickets.filter(t => t.status === "CREATED")));
  }

  openTicket(ticket: Ticket) {
    console.log("opening ticket " + ticket.id + ": " + ticket.title);
    this.router.navigate([`project/${this.projectId}/ticket/${ticket.id}`]);
  }

  deleteTicket(ticket: Ticket) {
    console.log("deleting ticket " + ticket.id + ": " + ticket.title);
    this.http.delete(`/tickets/${ticket.id}`).subscribe(() => {
      this.tickets = this.http.get<Ticket[]>(`/tickets?projectId=${this.projectId}`).pipe(shareReplay());
    });
  }

}
