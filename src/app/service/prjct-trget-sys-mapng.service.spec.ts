import { TestBed } from '@angular/core/testing';

import { PrjctTrgetSysMapngService } from './prjct-trget-sys-mapng.service';

describe('PrjctTrgetSysMapngService', () => {
  let service: PrjctTrgetSysMapngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrjctTrgetSysMapngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
