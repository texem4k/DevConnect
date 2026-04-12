import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicBoxBtn } from './topic-box-btn';

describe('TopicBoxBtn', () => {
  let component: TopicBoxBtn;
  let fixture: ComponentFixture<TopicBoxBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicBoxBtn],
    }).compileComponents();

    fixture = TestBed.createComponent(TopicBoxBtn);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
