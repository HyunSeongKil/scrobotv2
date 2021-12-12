import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmnSharePrjctDialogComponent } from './cmmn-share-prjct-dialog.component';

describe('CmmnSharePrjctDialogComponent', () => {
  let component: CmmnSharePrjctDialogComponent;
  let fixture: ComponentFixture<CmmnSharePrjctDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmmnSharePrjctDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmnSharePrjctDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
