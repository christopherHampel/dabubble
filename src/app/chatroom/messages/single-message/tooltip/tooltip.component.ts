import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { EmojiPickerComponentComponent } from '../../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';
import { ThreadsDbService } from '../../../../services/message/threads-db.service';
import { Thread } from '../../../../interfaces/thread';
import { ChatsService } from '../../../../services/message/chats.service';
import { ChatData } from '../../../../interfaces/chat-data';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-tooltip',
  imports: [MatMenuModule, MatIconModule, EmojiPickerComponentComponent, CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {

  testEmoji: any = { char: '😀', name: 'Grinning Face', category: 'Smileys' };
  currentMessage: any;
  emojiMartOpen: boolean = false;
  menu: boolean = false;
  private chat = inject(ChatsService);
  private threadsDb = inject(ThreadsDbService);
  @Input() isEditing: boolean = false;
  @Input() message: any;
  @Output() isEditingChange = new EventEmitter<boolean>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  editMessage() {
    this.isEditing = true;
    this.menu = false;
    this.isEditingChange.emit(this.isEditing);
  }

  addEmojiToMessage(placeholder: string, placeholder2: string) { }

  toggleEmoji() {
    this.emojiMartOpen = !this.emojiMartOpen;
  }

  toggleMenu() {
    this.menu = !this.menu;
  }

  async openThread() {
    if (this.threadsDb.setCurrentThreadId(this.message)) {
      this.threadsDb.subMessageList(this.threadsDb.currentThreadId());
    } else {
      console.log('Chat: ', this.chat.chatData.participantsDetails);
      let thread: ChatData = {
        chatId: '',
        participants: this.chat.chatData.participants,
        belongsToMessage: this.message.docId,
        participantsDetails: this.chat.chatData.participantsDetails
      }
      await this.threadsDb.addThread(thread, this.message);
    }

    this.router.navigate(['/chatroom', { outlets: { thread: ['thread', this.threadsDb.currentThreadId()] } }]);
  }
}
