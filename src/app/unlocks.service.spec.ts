import { TestBed } from '@angular/core/testing';

import { UnlocksService } from './unlocks.service';

describe('UnlocksService', () => {
  let service: UnlocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnlocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
