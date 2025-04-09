import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HireAnalyticsComponent } from './hire-analytics.component';

describe('HireAnalyticsComponent', () => {
  let component: HireAnalyticsComponent;
  let fixture: ComponentFixture<HireAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HireAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HireAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
