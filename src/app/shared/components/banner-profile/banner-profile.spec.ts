import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerProfile } from './banner-profile';

describe('BannerProfile', () => {
  let component: BannerProfile;
  let fixture: ComponentFixture<BannerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
