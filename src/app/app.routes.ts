import { Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { CreateTicketComponent } from './create-ticket/create-ticket.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProjectBacklogComponent } from './project-backlog/project-backlog.component';
import { AuthGuardService } from './services/auth-guard.service';
import { TicketDetailsComponent } from './ticket-details/ticket-details.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: '',
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        title: 'Home'
      },
      {
        path: 'createProject',
        component: CreateProjectComponent,
        title: "Create Project"
      },
      {
        path: 'project/:id/backlog',
        component: ProjectBacklogComponent,
        title: 'Backlog'
      },
      {
        path: 'project/:id/create-ticket',
        component: CreateTicketComponent,
        title: 'Create Ticket'
      },
      {
        path: 'project/:id/ticket/:ticketId',
        component: TicketDetailsComponent,
        title: 'Ticket Details'
      },
      {
        path: '**',
        redirectTo: 'home'
      }
    ]
  }
];
