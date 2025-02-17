import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMembersInfoComponent } from './channel-members-info.component';

describe('ChannelMembersInfoComponent', () => {
  let component: ChannelMembersInfoComponent;
  let fixture: ComponentFixture<ChannelMembersInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelMembersInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelMembersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
