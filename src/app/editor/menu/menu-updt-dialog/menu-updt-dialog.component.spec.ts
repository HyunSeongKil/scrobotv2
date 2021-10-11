import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUpdtDialogComponent } from './menu-updt-dialog.component';

describe('MenuUpdtDialogComponent', () => {
  let component: MenuUpdtDialogComponent;
  let fixture: ComponentFixture<MenuUpdtDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuUpdtDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuUpdtDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
