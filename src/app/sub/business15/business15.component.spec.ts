import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Business15Component } from './business15.component';

describe('Business15Component', () => {
  let component: Business15Component;
  let fixture: ComponentFixture<Business15Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Business15Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Business15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
