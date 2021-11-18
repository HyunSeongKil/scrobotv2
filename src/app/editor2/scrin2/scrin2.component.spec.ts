import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scrin2Component } from './scrin2.component';

describe('Scrin2Component', () => {
  let component: Scrin2Component;
  let fixture: ComponentFixture<Scrin2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Scrin2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Scrin2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
