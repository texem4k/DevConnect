import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSkills } from './user-skills';

describe('UserSkills', () => {
  let component: UserSkills;
  let fixture: ComponentFixture<UserSkills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSkills],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSkills);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
