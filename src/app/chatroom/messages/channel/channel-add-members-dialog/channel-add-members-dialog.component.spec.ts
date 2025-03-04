import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAddMembersDialogComponent } from './channel-add-members-dialog.component';

describe('ChannelAddMembersDialogComponent', () => {
  let component: ChannelAddMembersDialogComponent;
  let fixture: ComponentFixture<ChannelAddMembersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelAddMembersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelAddMembersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
