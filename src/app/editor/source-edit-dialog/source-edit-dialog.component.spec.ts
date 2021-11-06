import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceEditDialogComponent } from './source-edit-dialog.component';

describe('SourceEditDialogComponent', () => {
  let component: SourceEditDialogComponent;
  let fixture: ComponentFixture<SourceEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
