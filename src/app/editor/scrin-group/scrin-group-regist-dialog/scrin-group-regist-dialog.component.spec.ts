import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrinGroupRegistDialogComponent } from './scrin-group-regist-dialog.component';

describe('ScrinGroupRegistDialogComponent', () => {
  let component: ScrinGroupRegistDialogComponent;
  let fixture: ComponentFixture<ScrinGroupRegistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrinGroupRegistDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrinGroupRegistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
