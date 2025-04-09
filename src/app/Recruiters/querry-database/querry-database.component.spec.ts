import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerryDatabaseComponent } from './querry-database.component';

describe('QuerryDatabaseComponent', () => {
  let component: QuerryDatabaseComponent;
  let fixture: ComponentFixture<QuerryDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuerryDatabaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuerryDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
