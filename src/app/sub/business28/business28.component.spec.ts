import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Business28Component } from './business28.component';

describe('Business28Component', () => {
  let component: Business28Component;
  let fixture: ComponentFixture<Business28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Business28Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Business28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
