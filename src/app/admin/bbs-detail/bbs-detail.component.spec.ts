import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsDetailComponent } from './bbs-detail.component';

describe('BbsDetailComponent', () => {
  let component: BbsDetailComponent;
  let fixture: ComponentFixture<BbsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
