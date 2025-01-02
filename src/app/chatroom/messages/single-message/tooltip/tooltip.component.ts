import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { EmojiPickerComponentComponent } from '../../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tooltip',
  imports: [ MatMenuModule, MatIconModule, EmojiPickerComponentComponent, CommonModule ],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {

  currentMessage:any;
  emojiMartOpen:boolean = false;
  @Input() isEditing:boolean = false;
  @Output() isEditingChange = new EventEmitter<boolean>();

  editMessage() {
    this.isEditing = true;
    this.isEditingChange.emit(this.isEditing);
  }

  addEmojiToMessage(placeholder:string, placeholder2:string){}

  toggleEmoji() {
    this.emojiMartOpen = !this.emojiMartOpen;
  }

  openThread() {
    
  }
}
