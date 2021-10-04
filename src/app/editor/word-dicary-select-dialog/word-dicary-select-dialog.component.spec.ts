import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordDicarySelectDialogComponent } from './word-dicary-select-dialog.component';

describe('WordDicarySelectDialogComponent', () => {
  let component: WordDicarySelectDialogComponent;
  let fixture: ComponentFixture<WordDicarySelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordDicarySelectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordDicarySelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
