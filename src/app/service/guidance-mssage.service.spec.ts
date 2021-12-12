import { TestBed } from '@angular/core/testing';

import { GuidanceMssageService } from './guidance-mssage.service';

describe('GuidanceMssageService', () => {
  let service: GuidanceMssageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuidanceMssageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
