import { TestBed } from '@angular/core/testing';

import { PrjctCmmnCodeService } from './prjct-cmmn-code.service';

describe('PrjctCmmnCodeService', () => {
  let service: PrjctCmmnCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrjctCmmnCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
