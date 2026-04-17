import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProject } from './manage-project';

describe('ManageProject', () => {
  let component: ManageProject;
  let fixture: ComponentFixture<ManageProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProject],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageProject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
