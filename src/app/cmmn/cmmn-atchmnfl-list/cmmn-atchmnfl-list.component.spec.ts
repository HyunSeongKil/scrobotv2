import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmnAtchmnflListComponent } from './cmmn-atchmnfl-list.component';

describe('CmmnAtchmnflListComponent', () => {
  let component: CmmnAtchmnflListComponent;
  let fixture: ComponentFixture<CmmnAtchmnflListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmmnAtchmnflListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmnAtchmnflListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
