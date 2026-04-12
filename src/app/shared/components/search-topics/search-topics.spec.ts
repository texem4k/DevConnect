import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTopics } from './search-topics';

describe('SearchTopics', () => {
  let component: SearchTopics;
  let fixture: ComponentFixture<SearchTopics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTopics],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchTopics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
