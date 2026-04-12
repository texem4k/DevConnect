import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicsGrid } from './topics-grid';

describe('TopicsGrid', () => {
  let component: TopicsGrid;
  let fixture: ComponentFixture<TopicsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicsGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
