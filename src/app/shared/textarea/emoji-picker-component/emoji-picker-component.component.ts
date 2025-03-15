import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-emoji-picker-component',
  imports: [ PickerComponent ],
  templateUrl: './emoji-picker-component.component.html',
  styleUrl: './emoji-picker-component.component.scss'
})
export class EmojiPickerComponentComponent {

  @Output() emojiSelected = new EventEmitter<string>();
  @Input() message:any = '';

  addEmoji(event: { emoji: { native: string } }) {
    const emoji = event.emoji.native;
    this.emojiSelected.emit(emoji);
  }
}
