import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatroomHeaderComponent } from './chatroom-header.component';

describe('ChatroomHeaderComponent', () => {
  let component: ChatroomHeaderComponent;
  let fixture: ComponentFixture<ChatroomHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatroomHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatroomHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
