import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelDataWindowComponent } from './channel-data-window.component';

describe('ChannelDataWindowComponent', () => {
  let component: ChannelDataWindowComponent;
  let fixture: ComponentFixture<ChannelDataWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelDataWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelDataWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
