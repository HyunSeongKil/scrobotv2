import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compn2Component } from './compn2.component';

describe('Compn2Component', () => {
  let component: Compn2Component;
  let fixture: ComponentFixture<Compn2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Compn2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Compn2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
