import { TestBed } from '@angular/core/testing';

import { FireDbService } from './fire-db.service';

describe('FireDbService', () => {
  let service: FireDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FireDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
