import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrjctCmmnCodeUpdateDialogComponent } from './prjct-cmmn-code-update-dialog.component';

describe('PrjctCmmnCodeUpdateDialogComponent', () => {
  let component: PrjctCmmnCodeUpdateDialogComponent;
  let fixture: ComponentFixture<PrjctCmmnCodeUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrjctCmmnCodeUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrjctCmmnCodeUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
