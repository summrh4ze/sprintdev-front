import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable, shareReplay } from 'rxjs';
import { Project } from '../domain/project';
import { UserInfo } from '../domain/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public projects: Observable<Project[]>;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    this.projects = this.http.get<Project[]>("/projects").pipe(shareReplay());
  }

  getUserInfo(): Observable<UserInfo> {
    return this.auth.userInfo;
  }

  openProject(projectId: number) {
    this.router.navigate([`project/${projectId}/backlog`]);
  }
}
