import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, OnDestroy, OnChanges, SimpleChanges, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SingleMessageComponent } from '../../messages/single-message/single-message.component';
import { Observable } from 'rxjs';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { EmojisService } from '../../../services/message/emojis.service';
import { ScrollService } from '../../../services/message/scroll.service';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent, EmojiPickerComponentComponent ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('myScrollContainer') private myScrollContainer!: ElementRef;
  @ViewChildren(SingleMessageComponent) messageComponents!: QueryList<SingleMessageComponent>;

  chatId!: string;
  chatMessages$!: Observable<any[]>;
  emojiQuickBar:boolean = false;
  hasScrolled: boolean = false;
  emojiService = inject(EmojisService);
  private hasScrolledToBottom: boolean = false;
  routerSubscription: any;

  constructor(  private route: ActivatedRoute, 
                public chatService: ChatsService,
                private scrollService: ScrollService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      this.hasScrolledToBottom = false;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id')!;
      this.chatService.getChatInformationen(this.chatId);
      this.chatMessages$ = this.chatService.messages$;
      this.scrollService.hasScrolled = false;
      this.hasScrolledToBottom = false; // Reset when chatId changes
    });
  }

  ngAfterViewInit() {
    this.scrollService.setScrollContainer(this.myScrollContainer);
  }

  ngAfterViewChecked() {
    if (!this.hasScrolledToBottom && this.messageComponents.length > 0) {
      this.scrollService.scrollToBottom();
      this.hasScrolledToBottom = true;
    }
    console.log('hasscrolledBottom', this.hasScrolledToBottom)
  }

  ngOnDestroy(): void {
    this.chatId = '';
    this.hasScrolledToBottom = false;
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

  scrollDown(){
    this.scrollService.scrollToBottom();
  }

  // scrollToBottom(): void {
  //   try {
  //     this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  //   } catch(err) { }                 
  // }

  // ngAfterViewChecked() {

  // }
}