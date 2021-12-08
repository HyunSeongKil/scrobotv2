import { TestBed } from '@angular/core/testing';

import { StplatService } from './stplat.service';

describe('StplatService', () => {
  let service: StplatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StplatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
