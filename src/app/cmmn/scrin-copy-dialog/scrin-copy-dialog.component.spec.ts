import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrinCopyDialogComponent } from './scrin-copy-dialog.component';

describe('ScrinCopyDialogComponent', () => {
  let component: ScrinCopyDialogComponent;
  let fixture: ComponentFixture<ScrinCopyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScrinCopyDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrinCopyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
