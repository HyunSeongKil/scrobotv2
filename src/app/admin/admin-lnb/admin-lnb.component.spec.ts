import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLnbComponent } from './admin-lnb.component';

describe('AdminLnbComponent', () => {
  let component: AdminLnbComponent;
  let fixture: ComponentFixture<AdminLnbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminLnbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLnbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
