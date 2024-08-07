import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, map, Observable, Observer, shareReplay } from 'rxjs';
import { UserInfo, UserRole } from '../domain/user';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {
  projectName: string = "";
  projectDescription: string = "";
  selectedUser: string = "";
  selectedRole: string = "DEV";
  allUsers: Observable<UserInfo[]>;
  userRoles: UserRole[] = [];


  constructor(private readonly http: HttpClient, private readonly router: Router) {
    this.allUsers = http.get<UserInfo[]>("/users").pipe(shareReplay());
  }

  canSubmit() {
    return this.projectName !== "" &&
      this.projectDescription !== "" &&
      this.userRoles.length > 0;
  }

  handleSubmit() {
    const observer: Observer<any> = {
      next: res => {
        console.log(res);
        this.router.navigate(['home']);
      },
      error: err => console.error(err),
      complete: () => console.log("POST /projects completed")
    }

    this.http.post("/projects", {
      name: this.projectName,
      description: this.projectDescription,
      assignedUsers: this.userRoles.map(ur => ({
        id: ur.user.id,
        roles: [ur.role]
      })),
    }).subscribe(observer);
  }

  addUserRole() {
    if (this.selectedUser != null) {
      this.allUsers.pipe(
        map(users => users.find(u => u.id == parseFloat(this.selectedUser))),
        filter(u => u !== null && u != undefined),
      ).subscribe(
        user => {
          if (this.selectedRole != null) {
            if (!this.userRoles.some(ur => ur.user.id === user.id)) {
              this.userRoles.push({ user: user, role: this.selectedRole });
            }
          }
        }
      );
    }
  }

  removeUserRole(userRole: UserRole) {
    this.userRoles = this.userRoles.filter(ur => ur.user.id !== userRole.user.id);
  }
}
