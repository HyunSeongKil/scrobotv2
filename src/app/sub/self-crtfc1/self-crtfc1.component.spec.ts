import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfCrtfc1Component } from './self-crtfc1.component';

describe('SelfCrtfc1Component', () => {
  let component: SelfCrtfc1Component;
  let fixture: ComponentFixture<SelfCrtfc1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfCrtfc1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfCrtfc1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
