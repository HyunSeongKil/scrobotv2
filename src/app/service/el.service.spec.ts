import { TestBed } from '@angular/core/testing';

import { ElService } from './el.service';

describe('ElService', () => {
  let service: ElService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
