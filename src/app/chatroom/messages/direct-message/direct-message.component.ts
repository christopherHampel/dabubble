import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { Observable, Subscription } from 'rxjs';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { EmojisService } from '../../../services/message/emojis.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { MessagesFieldComponent } from "../../../shared/messages-field/messages-field.component";

@Component({
  selector: 'app-direct-message',
  imports: [CommonModule, FormsModule, TextareaComponent, EmojiPickerComponentComponent, MessagesFieldComponent],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})

export class DirectMessageComponent implements OnDestroy {

  chatId!: string;
  chatMessages$!: Observable<any[]>;
  emojiQuickBar:boolean = false;
  emojiService = inject(EmojisService);
  private paramMapSubscription!: Subscription;
  
  constructor(  private route: ActivatedRoute, 
                public chatService: ChatsService,
                private usersService: UsersDbService) { }

  ngOnInit(): void {
    this.getIdFromUrl();
  }
  
  getIdFromUrl() {
    this.paramMapSubscription = this.route.paramMap.subscribe(params => {
      const newChatId = params.get('id');
      if (newChatId && newChatId !== this.chatId) {
        this.chatId = newChatId;
        this.chatService.getChatInformationen(this.chatId, "messages");
        this.chatMessages$ = this.chatService.messages$;
      }
    });
  } 

  ngOnDestroy(): void {
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
    }
  }

  addEmoji(event:string) {
    this.emojiService.addEmoji(event, this.chatId, 'messages');
  }

  isPrivateChat(): boolean {
    return this.usersService.currentUserSig()?.userName === this.chatService.chatPartner.name;
  }

  showProfile() {
    console.log("Profil anzeigen!");
  }
}