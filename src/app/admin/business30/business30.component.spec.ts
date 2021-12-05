import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Business30Component } from './business30.component';

describe('Business30Component', () => {
  let component: Business30Component;
  let fixture: ComponentFixture<Business30Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Business30Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Business30Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
