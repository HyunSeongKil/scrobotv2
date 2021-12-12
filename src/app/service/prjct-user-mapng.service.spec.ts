import { TestBed } from '@angular/core/testing';

import { PrjctUserMapngService } from './prjct-user-mapng.service';

describe('PrjctUserMapngService', () => {
  let service: PrjctUserMapngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrjctUserMapngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
