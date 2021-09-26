import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrjctUpdtDialogComponent } from './prjct-updt-dialog.component';

describe('PrjctUpdtDialogComponent', () => {
  let component: PrjctUpdtDialogComponent;
  let fixture: ComponentFixture<PrjctUpdtDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrjctUpdtDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrjctUpdtDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
