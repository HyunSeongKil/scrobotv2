import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmnViewSourceDialogComponent } from './cmmn-view-source-dialog.component';

describe('CmmnViewSourceDialogComponent', () => {
  let component: CmmnViewSourceDialogComponent;
  let fixture: ComponentFixture<CmmnViewSourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmmnViewSourceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmnViewSourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
