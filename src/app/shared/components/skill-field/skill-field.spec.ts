import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillField } from './skill-field';

describe('SkillField', () => {
  let component: SkillField;
  let fixture: ComponentFixture<SkillField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillField],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
