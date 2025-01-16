import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { EmojiPickerComponentComponent } from '../../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';
import { ThreadsDbService } from '../../../../services/message/threads-db.service';
import { Thread } from '../../../../interfaces/thread';
import { ChatsService } from '../../../../services/message/chats.service';

@Component({
  selector: 'app-tooltip',
  imports: [ MatMenuModule, MatIconModule, EmojiPickerComponentComponent, CommonModule ],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {

  currentMessage:any;
  emojiMartOpen:boolean = false;
  menu:boolean = false;
  private chat = inject(ChatsService);
  private threadsDb = inject(ThreadsDbService);
  @Input() isEditing:boolean = false;
  @Input() message: any;
  @Output() isEditingChange = new EventEmitter<boolean>();

  editMessage() {
    this.isEditing = true;
    this.menu = false;
    this.isEditingChange.emit(this.isEditing);
  }

  addEmojiToMessage(placeholder:string, placeholder2:string){}

  toggleEmoji() {
    this.emojiMartOpen = !this.emojiMartOpen;
  }

  toggleMenu() {
    this.menu = !this.menu;
  }

  async openThread() {
    console.log('Thread list to find thread: ', this.threadsDb.threadList);
    console.log('Thread list to find message id: ', this.chat.chatData.docId);
    console.log(this.threadsDb.threadList.find(thread => thread.belongsToMessage === this.chat.chatData.docId));

    console.log('Chat: ', this.chat.chatData.participantsDetails);
    let thread: Thread = {
      participiants: this.chat.chatData.participants,
      belongsToMessage: this.message.docId,
      participiantsDetails:this.chat.chatData.participantsDetails 
    }

    await this.threadsDb.addThread(thread, this.message);
  }
}
