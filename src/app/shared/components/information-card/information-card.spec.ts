import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationCard } from './information-card';

describe('InformationCard', () => {
  let component: InformationCard;
  let fixture: ComponentFixture<InformationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationCard],
    }).compileComponents();

    fixture = TestBed.createComponent(InformationCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
