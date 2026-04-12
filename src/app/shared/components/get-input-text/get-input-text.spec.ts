import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetInputText } from './get-input-text';

describe('GetInputText', () => {
  let component: GetInputText;
  let fixture: ComponentFixture<GetInputText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetInputText],
    }).compileComponents();

    fixture = TestBed.createComponent(GetInputText);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
