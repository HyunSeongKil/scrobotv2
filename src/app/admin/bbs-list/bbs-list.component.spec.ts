import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsListComponent } from './bbs-list.component';

describe('BbsListComponent', () => {
  let component: BbsListComponent;
  let fixture: ComponentFixture<BbsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
