import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrinUpdtDialogComponent } from './scrin-updt-dialog.component';

describe('ScrinUpdtDialogComponent', () => {
  let component: ScrinUpdtDialogComponent;
  let fixture: ComponentFixture<ScrinUpdtDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrinUpdtDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrinUpdtDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
