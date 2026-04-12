import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataField } from './user-data-field';

describe('UserDataField', () => {
  let component: UserDataField;
  let fixture: ComponentFixture<UserDataField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDataField],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDataField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
