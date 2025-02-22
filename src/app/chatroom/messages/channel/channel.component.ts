import { Component, effect, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsDbService } from '../../../services/message/channels-db.service';
import { ActivatedRoute } from '@angular/router';
import { EmojisService } from '../../../services/message/emojis.service';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { ChatsService } from '../../../services/message/chats.service';
import { SingleMessageComponent } from '../single-message/single-message.component';
import { ScrollService } from '../../../services/message/scroll.service';

@Component({
  selector: 'app-channel',
  imports: [
    CommonModule,
    EmojiPickerComponentComponent,
    TextareaComponent,
    SingleMessageComponent,
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
  providers: [ScrollService],
})
export class ChannelComponent {
  channelDb = inject(ChannelsDbService);
  chatId: string = '';

  @ViewChild('myScrollContainer') private myScrollContainer!: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    public emojiService: EmojisService,
    public chatService: ChatsService,
    private scrollService: ScrollService
  ) {
    effect(() => {
      const currentDocId = this.chatService.lastMessageDocId();
      if (currentDocId) {
        this.scrollService.scrollToBottom();
      }
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.channelDb.subToChannel(params['id']);
      this.chatId = params['id'];
      this.getMessages();
      this.chatService.watchLastMessageDocId(this.chatId, 'channels')
    });
  }

  getMessages() {
    this.chatService.getMessagesFromChat(this.chatId, 'channels');
  }

  getChannelParticipantsDetails() {
    return this.channelDb.channelData.participantsDetails;
  }

  addEmoji(event: string) {
    console.log(event);
    this.emojiService.addEmoji(event, this.chatId, 'channels');
  }

  trackByFn(index: number, item: any): number | string {
    return item.id;
  }

  ngAfterViewInit() {
    this.scrollService.setScrollContainer(this.myScrollContainer);
  }
}
