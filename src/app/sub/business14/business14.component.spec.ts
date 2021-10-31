import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Business14Component } from './business14.component';

describe('Business14Component', () => {
  let component: Business14Component;
  let fixture: ComponentFixture<Business14Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Business14Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Business14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
