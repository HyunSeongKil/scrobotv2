import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BbsUpdtComponent } from './bbs-updt.component';

describe('BbsUpdtComponent', () => {
  let component: BbsUpdtComponent;
  let fixture: ComponentFixture<BbsUpdtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BbsUpdtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BbsUpdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
