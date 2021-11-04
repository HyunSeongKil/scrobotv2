import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfCrtfc3Component } from './self-crtfc3.component';

describe('SelfCrtfc3Component', () => {
  let component: SelfCrtfc3Component;
  let fixture: ComponentFixture<SelfCrtfc3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelfCrtfc3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelfCrtfc3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
