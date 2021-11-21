import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmnPagerComponent } from './cmmn-pager.component';

describe('CmmnPagerComponent', () => {
  let component: CmmnPagerComponent;
  let fixture: ComponentFixture<CmmnPagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmmnPagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmnPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
