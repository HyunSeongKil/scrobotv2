import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompnComponent } from './compn.component';

describe('CompnComponent', () => {
  let component: CompnComponent;
  let fixture: ComponentFixture<CompnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
