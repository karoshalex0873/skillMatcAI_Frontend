import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadidateMatchComponent } from './cadidate-match.component';

describe('CadidateMatchComponent', () => {
  let component: CadidateMatchComponent;
  let fixture: ComponentFixture<CadidateMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadidateMatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadidateMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
