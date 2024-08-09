import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBacklogComponent } from './project-backlog.component';

describe('ProjectBacklogComponent', () => {
  let component: ProjectBacklogComponent;
  let fixture: ComponentFixture<ProjectBacklogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectBacklogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
