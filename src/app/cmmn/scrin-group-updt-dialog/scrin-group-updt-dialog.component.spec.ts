import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrinGroupUpdtDialogComponent } from './scrin-group-updt-dialog.component';

describe('ScrinGroupUpdtDialogComponent', () => {
  let component: ScrinGroupUpdtDialogComponent;
  let fixture: ComponentFixture<ScrinGroupUpdtDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrinGroupUpdtDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrinGroupUpdtDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
