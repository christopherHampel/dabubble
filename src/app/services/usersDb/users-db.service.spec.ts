import { TestBed } from '@angular/core/testing';

import { UsersDbService } from './users-db.service';

describe('UsersDbService', () => {
  let service: UsersDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
