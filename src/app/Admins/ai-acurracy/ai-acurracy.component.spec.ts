import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAcurracyComponent } from './ai-acurracy.component';

describe('AiAcurracyComponent', () => {
  let component: AiAcurracyComponent;
  let fixture: ComponentFixture<AiAcurracyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiAcurracyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiAcurracyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
