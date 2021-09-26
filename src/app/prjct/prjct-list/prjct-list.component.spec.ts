import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrjctListComponent } from './prjct-list.component';

describe('PrjctListComponent', () => {
  let component: PrjctListComponent;
  let fixture: ComponentFixture<PrjctListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrjctListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrjctListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
