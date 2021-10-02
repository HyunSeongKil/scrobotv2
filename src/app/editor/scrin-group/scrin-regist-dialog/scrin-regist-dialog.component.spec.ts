import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrinRegistDialogComponent } from './scrin-regist-dialog.component';

describe('ScrinRegistDialogComponent', () => {
  let component: ScrinRegistDialogComponent;
  let fixture: ComponentFixture<ScrinRegistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrinRegistDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrinRegistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
