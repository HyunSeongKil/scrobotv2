import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrjctRegistDialogComponent } from './prjct-regist-dialog.component';

describe('PrjctRegistDialogComponent', () => {
  let component: PrjctRegistDialogComponent;
  let fixture: ComponentFixture<PrjctRegistDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrjctRegistDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrjctRegistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
