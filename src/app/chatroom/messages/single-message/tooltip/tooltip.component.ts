import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { EmojiPickerComponentComponent } from '../../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';
import { ThreadsDbService } from '../../../../services/message/threads-db.service';
import { Thread } from '../../../../interfaces/thread';

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
  private threadsDb = inject(ThreadsDbService);
  @Input() isEditing:boolean = false;
  @Input() messageId: string = '';
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
    let thread: Thread = {
      participiants: [
        'User1',
        'User2',
        'User3'
      ],
      belongsToMessage: this.messageId,
      participiantsDetails: {
        ['User123']: {
          name: 'Test1',
          avatar: 'Bild1'
        },
        ['User456']: {
          name: 'Test2',
          avatar: 'Bild2'
        },
        ['User789']: {
          name: 'Test3',
          avatar: 'Bild3'
        }
      }
    }

    await this.threadsDb.addThread(thread);
  }
}
