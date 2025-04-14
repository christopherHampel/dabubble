import { TestBed } from '@angular/core/testing';

import { DialogWindowControlService } from './dialog-window-control.service';

describe('DialogWindowControlService', () => {
  let service: DialogWindowControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogWindowControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
