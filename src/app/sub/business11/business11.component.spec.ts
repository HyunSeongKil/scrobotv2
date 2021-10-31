import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Business11Component } from './business11.component';

describe('Business11Component', () => {
  let component: Business11Component;
  let fixture: ComponentFixture<Business11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Business11Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Business11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
