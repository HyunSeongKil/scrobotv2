import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StplatRegistComponent } from './stplat-regist.component';

describe('StplatRegistComponent', () => {
  let component: StplatRegistComponent;
  let fixture: ComponentFixture<StplatRegistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StplatRegistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StplatRegistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
