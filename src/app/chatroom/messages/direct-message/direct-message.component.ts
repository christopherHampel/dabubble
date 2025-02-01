import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SingleMessageComponent } from '../single-message/single-message.component';
import { Observable } from 'rxjs';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { EmojiService } from '../../../services/message/emoji.service';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent, EmojiPickerComponentComponent ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent {

  @ViewChild('messageField') private messageContainer!: ElementRef;
  @ViewChild(SingleMessageComponent) childComponent!: SingleMessageComponent;

  private observer!: MutationObserver;

  chatId!: string;
  chatMessages$!: Observable<any[]>;
  emojiQuickBar:boolean = false;

  emojiService = inject(EmojiService);

  constructor(private route: ActivatedRoute, public chatService: ChatsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id')!;
      this.chatService.getChatInformationen(this.chatId);
      this.chatMessages$ = this.chatService.messages$;
    });
  }

  ngAfterViewInit(): void {
    this.setupObserver();
  }

  private setupObserver(): void {
    if (!this.messageContainer) {
      setTimeout(() => this.setupObserver(), 100); // Falls das Element noch nicht geladen ist, erneut versuchen
      return;
    }

    this.observer = new MutationObserver(() => {
      this.scrollToBottom();
    });

    this.observer.observe(this.messageContainer.nativeElement, {
      childList: true, // Erkennt neue Nachrichten im DOM
      subtree: true,
    });

    this.scrollToBottom(); // Direkt beim Laden scrollen
  }

  private scrollToBottom(): void {
    if (this.messageContainer) {
      try {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Fehler beim Scrollen:', err);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect(); // Verhindert Speicherlecks
    }
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
    return item.id; // Eindeutige ID für jedes Element
  }

  closeEmojiBars() {
    if (this.childComponent.emojiQuickBar) {
      this.childComponent.toggleEmojiQuickBar();
    }
    console.log(this.emojiService.emojiPickerOpen);
    if(this.emojiService.emojiPickerOpen) {
      this.emojiService.emojiPickerOpen = false;
    }
  }
}