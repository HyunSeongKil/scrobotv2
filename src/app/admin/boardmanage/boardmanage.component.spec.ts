import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardmanageComponent } from './boardmanage.component';

describe('BoardmanageComponent', () => {
  let component: BoardmanageComponent;
  let fixture: ComponentFixture<BoardmanageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardmanageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
