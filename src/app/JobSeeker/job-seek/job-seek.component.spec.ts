import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSeekComponent } from './job-seek.component';

describe('JobSeekComponent', () => {
  let component: JobSeekComponent;
  let fixture: ComponentFixture<JobSeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobSeekComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobSeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
