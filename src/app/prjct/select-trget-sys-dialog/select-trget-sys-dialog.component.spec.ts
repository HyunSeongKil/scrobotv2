import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTrgetSysDialogComponent } from './select-trget-sys-dialog.component';

describe('DeployDialogComponent', () => {
  let component: SelectTrgetSysDialogComponent;
  let fixture: ComponentFixture<SelectTrgetSysDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectTrgetSysDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTrgetSysDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
