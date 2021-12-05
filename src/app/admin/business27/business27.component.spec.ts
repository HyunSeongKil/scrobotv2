import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Business27Component } from './business27.component';

describe('Business27Component', () => {
  let component: Business27Component;
  let fixture: ComponentFixture<Business27Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Business27Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Business27Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
