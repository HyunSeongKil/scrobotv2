import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Business4Component } from './business4.component';

describe('Business4Component', () => {
  let component: Business4Component;
  let fixture: ComponentFixture<Business4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Business4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Business4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
