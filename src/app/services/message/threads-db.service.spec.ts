import { TestBed } from '@angular/core/testing';

import { ThreadsDbService } from './threads-db.service';

describe('ThreadsDbService', () => {
  let service: ThreadsDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreadsDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
