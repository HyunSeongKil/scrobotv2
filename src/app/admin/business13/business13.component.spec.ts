import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Business13Component } from './business13.component';

describe('Business13Component', () => {
  let component: Business13Component;
  let fixture: ComponentFixture<Business13Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Business13Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Business13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
