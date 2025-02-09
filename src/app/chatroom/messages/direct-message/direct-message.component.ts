import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, OnDestroy, OnChanges, SimpleChanges, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SingleMessageComponent } from '../../messages/single-message/single-message.component';
import { Observable, Subscription } from 'rxjs';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { EmojisService } from '../../../services/message/emojis.service';
import { ScrollService } from '../../../services/message/scroll.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent, EmojiPickerComponentComponent ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
  providers: [ScrollService] // Eigene Instanz des Services
})
export class DirectMessageComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('myScrollContainer') private myScrollContainer!: ElementRef;
  @ViewChildren(SingleMessageComponent) messageComponents!: QueryList<SingleMessageComponent>;

  chatId!: string;
  chatMessages$!: Observable<any[]>;
  emojiQuickBar:boolean = false;
  hasScrolled: boolean = false;
  emojiService = inject(EmojisService);
  private logoutSubscription!: Subscription;

  constructor(  private route: ActivatedRoute, 
                public chatService: ChatsService,
                private scrollService: ScrollService,
                private authService: AuthService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      // this.scrollService.hasScrolledDirectMessage = false;
      this.hasScrolled = false;
    }
  }

  ngOnInit(): void {
    this.getIdFromUrl();
    this.subcribeLogOut();
  }

  getIdFromUrl() {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id')!;
      this.chatService.getChatInformationen(this.chatId);
      this.chatMessages$ = this.chatService.messages$;
      // this.scrollService.hasScrolledDirectMessage = false;
      this.hasScrolled = false;
    });
  }

  subcribeLogOut() {
    this.logoutSubscription = this.authService.logout$.subscribe(() => {
      // this.scrollService.hasScrolledDirectMessage = false;
      this.hasScrolled = false;
    });
  }

  ngAfterViewInit() {
    this.scrollService.setScrollContainer(this.myScrollContainer);
  }

  ngAfterViewChecked() {
    if (!this.hasScrolled && this.messageComponents.length > 0) {
      // if (!this.scrollService.hasScrolledDirectMessage && this.messageComponents.length > 0) {
      setTimeout( () => {
        this.scrollService.scrollToBottom();
        // this.scrollService.hasScrolledDirectMessage = true;
        this.hasScrolled = true;
      }, 50)
    }
  }

  ngOnDestroy(): void {
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
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
    return item.id;
  }

  isDataLoaded(): boolean {
    return !!this.chatService.chatPartner &&
           !!this.chatService.chatPartner.avatar &&
           !!this.chatService.chatPartner.name &&
           this.chatMessages$ !== undefined;
}
}