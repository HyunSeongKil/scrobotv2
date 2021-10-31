import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Business20Component } from './business20.component';

describe('Business20Component', () => {
  let component: Business20Component;
  let fixture: ComponentFixture<Business20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Business20Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Business20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
