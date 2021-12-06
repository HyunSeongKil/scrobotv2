import { TestBed } from '@angular/core/testing';

import { SecsnService } from './secsn.service';

describe('SecsnService', () => {
  let service: SecsnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SecsnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
