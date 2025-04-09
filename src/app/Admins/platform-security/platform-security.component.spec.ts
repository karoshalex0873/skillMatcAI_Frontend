import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformSecurityComponent } from './platform-security.component';

describe('PlatformSecurityComponent', () => {
  let component: PlatformSecurityComponent;
  let fixture: ComponentFixture<PlatformSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformSecurityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
