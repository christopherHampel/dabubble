import { TestBed } from '@angular/core/testing';

import { ChannelsDbService } from './channels-db.service';

describe('ChannelsDbService', () => {
  let service: ChannelsDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelsDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
