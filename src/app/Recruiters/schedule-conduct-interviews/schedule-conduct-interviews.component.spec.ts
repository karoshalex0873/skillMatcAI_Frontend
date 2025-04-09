import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleConductInterviewsComponent } from './schedule-conduct-interviews.component';

describe('ScheduleConductInterviewsComponent', () => {
  let component: ScheduleConductInterviewsComponent;
  let fixture: ComponentFixture<ScheduleConductInterviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleConductInterviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleConductInterviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
