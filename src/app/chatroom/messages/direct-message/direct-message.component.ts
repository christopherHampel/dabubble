import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SingleMessageComponent } from '../single-message/single-message.component';
import { Observable } from 'rxjs';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { EmojisService } from '../../../services/message/emojis.service';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent, EmojiPickerComponentComponent ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent implements OnInit {

  @ViewChild('myScrollContainer') private myScrollContainer!: ElementRef;
  @ViewChild(SingleMessageComponent) childComponent!: SingleMessageComponent;
  @ViewChildren(SingleMessageComponent) messageComponents!: QueryList<SingleMessageComponent>;

  chatId!: string;
  chatMessages$!: Observable<any[]>;
  emojiQuickBar:boolean = false;

  emojiService = inject(EmojisService);

  constructor(private route: ActivatedRoute, public chatService: ChatsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id')!;
      this.chatService.getChatInformationen(this.chatId);
      this.chatMessages$ = this.chatService.messages$;
      this.chatService.hasScrolled = false;
    });
  }

  newDate(message:any) {
    const rawTimestamp = message.createdAt;
    if (rawTimestamp && typeof rawTimestamp.toMillis === "function") {
        const timestampInMs = rawTimestamp.toMillis();
        const messageDate = new Date(timestampInMs).toLocaleDateString("de-DE");

        console.log("Datum der Nachricht ist:", messageDate);
        return true;
    } else {
      return false;
    };
  }

  addEmoji(event:string) {
    console.log(event);
    this.emojiService.addEmoji(event, this.chatId);
  }

  trackByFn(index: number, item: any): number | string {
    return item.id;
  }

  closeEmojiBars() {
    if (this.childComponent.emojiQuickBar) {
      this.childComponent.toggleEmojiQuickBar();
    }
    if(this.emojiService.emojiPickerOpen) {
      this.emojiService.emojiPickerOpen = false;
    }
  }

  scrollDown(){
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  ngAfterViewChecked() {
    if (!this.chatService.hasScrolled && this.messageComponents.length > 0) {
      this.scrollToBottom();
      setTimeout(() => {
        this.scrollToBottom();
        this.chatService.hasScrolled = true;
      }, 100);
    }
  }
}