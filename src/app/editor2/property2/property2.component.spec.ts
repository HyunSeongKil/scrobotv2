import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Property2Component } from './property2.component';

describe('Property2Component', () => {
  let component: Property2Component;
  let fixture: ComponentFixture<Property2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Property2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Property2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
