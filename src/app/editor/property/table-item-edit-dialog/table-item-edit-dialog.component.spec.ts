import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableItemEditDialogComponent } from './table-item-edit-dialog.component';

describe('TableItemEditDialogComponent', () => {
  let component: TableItemEditDialogComponent;
  let fixture: ComponentFixture<TableItemEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableItemEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableItemEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
