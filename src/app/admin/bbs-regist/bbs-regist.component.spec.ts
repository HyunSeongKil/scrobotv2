import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsRegistComponent } from './bbs-regist.component';

describe('BbsRegistComponent', () => {
  let component: BbsRegistComponent;
  let fixture: ComponentFixture<BbsRegistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsRegistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbsRegistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
