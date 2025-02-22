import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, OnDestroy, OnChanges, SimpleChanges, QueryList, ViewChild, ViewChildren, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SingleMessageComponent } from '../../messages/single-message/single-message.component';
import { Observable, Subscription } from 'rxjs';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { EmojisService } from '../../../services/message/emojis.service';
import { ScrollService } from '../../../services/message/scroll.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UsersDbService } from '../../../services/usersDb/users-db.service';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent, EmojiPickerComponentComponent ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
  providers: [ScrollService],
})

export class DirectMessageComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('myScrollContainer') private myScrollContainer!: ElementRef;
  @ViewChildren(SingleMessageComponent) messageComponents!: QueryList<SingleMessageComponent>;

  chatId!: string;
  chatMessages$!: Observable<any[]>;
  emojiQuickBar:boolean = false;
  // hasScrolled: boolean = false;
  emojiService = inject(EmojisService);
  private logoutSubscription!: Subscription;
  private paramMapSubscription!: Subscription;
  
  constructor(  private route: ActivatedRoute, 
                public chatService: ChatsService,
                private scrollService: ScrollService,
                private authService: AuthService,
                private usersService: UsersDbService) { 
                  effect( () => {
                    const currentDocId = this.chatService.lastMessageDocId();
                    if(currentDocId) {
                      this.scrollService.scrollToBottom();
                    }
                  })
                }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      debugger;
      this.scrollService.hasScrolled = false;
    }
  }

  ngOnInit(): void {
    this.getIdFromUrl();
    this.subcribeLogOut();
  }
  
  getIdFromUrl() {
    this.paramMapSubscription = this.route.paramMap.subscribe(params => {
      const newChatId = params.get('id');
      if (newChatId && newChatId !== this.chatId) {
        this.chatId = newChatId;
        this.chatService.getChatInformationen(this.chatId, "messages");
        this.chatMessages$ = this.chatService.messages$;
        this.scrollService.hasScrolled = false;
      }
    });
  }  

  subcribeLogOut() {
    this.logoutSubscription = this.authService.logout$.subscribe(() => {
      this.scrollService.hasScrolled = false;
    });
  }

  ngAfterViewInit() {
    this.scrollService.setScrollContainer(this.myScrollContainer);
  }

  ngAfterViewChecked() {
    // console.log('Current sig is:', this.chatService.lastMessageDocId())    

    if (!this.scrollService.hasScrolled && this.messageComponents.length > 0) {
      setTimeout( () => {
        this.scrollService.scrollToBottom();
        this.scrollService.hasScrolled = true;
      }, 50)
    }
  }

  ngOnDestroy(): void {
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }

    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
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
    this.emojiService.addEmoji(event, this.chatId, 'messages');
  }

  trackByFn(index: number, item: any): number | string {
    return item.id;
  }

  // emptyChat() {
  //   return '(chatMessages$ | async)?.length === 0';
  // }

  isPrivateChat(): boolean {
    return this.usersService.currentUserSig()?.userName === this.chatService.chatPartner.name;
  }

  showProfile() {
    console.log("Profil anzeigen!");
  }
}