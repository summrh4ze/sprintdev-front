import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, Observable, Observer, shareReplay } from 'rxjs';
import { Sprint } from '../domain/project';
import { Ticket } from '../domain/ticket';

@Component({
  selector: 'app-create-sprint',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-sprint.component.html',
  styleUrl: './create-sprint.component.css'
})
export class CreateSprintComponent {
  projectId: number;
  tickets: Observable<Ticket[]>;
  selectedTicketIds: number[] = [];
  selectedTicketId = "0";
  sprintName: string = "";
  sprintDescription: string = "";

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.projectId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.tickets = this.http.get<Ticket[]>(`/tickets?projectId=${this.projectId}`).pipe(
      map(tickets => {
        return tickets.filter(t => t.status === "SPRINT_READY");
      }),
      shareReplay()
    );
  }

  handleSubmit() {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14);
    const observer: Observer<Sprint> = {
      next: res => this.router.navigate([`/project/${this.projectId}/backlog`]),
      error: err => alert(err.error.message),
      complete: () => console.log("PUT / completed")
    }
    this.tickets.pipe(
      mergeMap(t => {
        console.log("calling POST /sprints");
        return this.http.post<Sprint>(`/projects/${this.projectId}/sprints`, {
          name: this.sprintName,
          description: this.sprintDescription,
          startDate,
          endDate,
          project: {
            id: this.projectId,
          },
          ticketIds: this.selectedTicketIds
        });
      }),
    ).subscribe(observer);
  }

  addTicket() {
    const sid = parseInt(this.selectedTicketId);
    if (sid > 0 && !this.selectedTicketIds.includes(sid)) {
      this.selectedTicketIds.push(sid);
      this.selectedTicketId = "0";
    }
  }

  canSubmit() {
    return this.selectedTicketIds.length > 0 &&
      this.sprintName !== "" &&
      this.sprintDescription !== "";
  }

  getSelectedTickets() {
    return this.tickets.pipe(map(tickets => tickets.filter(t => this.selectedTicketIds.includes(t.id))))
  }

  getRemainingTickets() {
    return this.tickets.pipe(map(tickets => tickets.filter(t => !this.selectedTicketIds.includes(t.id))));
  }
}
