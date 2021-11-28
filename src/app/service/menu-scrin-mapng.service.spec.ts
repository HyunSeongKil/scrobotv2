import { TestBed } from '@angular/core/testing';

import { MenuScrinMapngService } from './menu-scrin-mapng.service';

describe('MenuScrinMapngService', () => {
  let service: MenuScrinMapngService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuScrinMapngService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
