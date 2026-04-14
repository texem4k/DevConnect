import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProfile } from './project-profile';

describe('ProjectProfile', () => {
  let component: ProjectProfile;
  let fixture: ComponentFixture<ProjectProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
