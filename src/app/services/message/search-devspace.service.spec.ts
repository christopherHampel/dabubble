import { TestBed } from '@angular/core/testing';

import { SearchDevspaceService } from './search-devspace.service';

describe('SearchDevspaceService', () => {
  let service: SearchDevspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchDevspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
