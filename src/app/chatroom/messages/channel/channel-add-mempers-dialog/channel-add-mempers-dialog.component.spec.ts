import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAddMempersDialogComponent } from './channel-add-mempers-dialog.component';

describe('ChannelAddMempersDialogComponent', () => {
  let component: ChannelAddMempersDialogComponent;
  let fixture: ComponentFixture<ChannelAddMempersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelAddMempersDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelAddMempersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
