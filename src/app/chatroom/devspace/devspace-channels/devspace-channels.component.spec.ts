import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevspaceChannelsComponent } from './devspace-channels.component';

describe('DevspaceChannelsComponent', () => {
  let component: DevspaceChannelsComponent;
  let fixture: ComponentFixture<DevspaceChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevspaceChannelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevspaceChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
