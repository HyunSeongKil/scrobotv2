import { TestBed } from '@angular/core/testing';

import { EditorHeaderService } from './editor-header.service';

describe('EditorHeaderService', () => {
  let service: EditorHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditorHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
