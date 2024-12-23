import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevspaceDirectmessagesComponent } from './devspace-directmessages.component';

describe('DevspaceDirectmessagesComponent', () => {
  let component: DevspaceDirectmessagesComponent;
  let fixture: ComponentFixture<DevspaceDirectmessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevspaceDirectmessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevspaceDirectmessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
