import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { Observable, Subscription } from 'rxjs';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { EmojisService } from '../../../services/message/emojis.service';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { MessagesFieldComponent } from '../../../shared/messages-field/messages-field.component';
import { ThreadsDbService } from '../../../services/message/threads-db.service';
import { UserProfilComponent } from '../../../shared/user-profil/user-profil.component';
import { DialogWindowControlService } from '../../../services/dialog-window-control/dialog-window-control.service';

@Component({
  selector: 'app-direct-message',
  imports: [
    CommonModule,
    FormsModule,
    TextareaComponent,
    EmojiPickerComponentComponent,
    MessagesFieldComponent,
    UserProfilComponent
  ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent implements OnDestroy {
  chatId!: string;
  chatMessages$!: Observable<any[]>;
  emojiQuickBar: boolean = false;
  emojiService = inject(EmojisService);
  dialogWindowControl = inject(DialogWindowControlService);
  private paramMapSubscription!: Subscription;
  userProfil: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public chatService: ChatsService,
    private usersService: UsersDbService,
    private threadsDB: ThreadsDbService,
  ) { }

  ngOnInit(): void {
    this.getIdFromUrl();
  }

  openUserProfilDialog() {
    this.dialogWindowControl.openDialog('userProfil');
    this.userProfil = true;
    this.chatService.setZIndexForNavBarButton(true);
  }

  closeUserProfilDialog(event: boolean) {
    this.userProfil = event;
    this.chatService.setZIndexForNavBarButton(false);
  }

  getIdFromUrl() {
    this.paramMapSubscription = this.route.paramMap.subscribe((params) => {
      const newChatId = params.get('id');
      if (newChatId && newChatId !== this.chatId) {
        this.chatId = newChatId;
        this.threadsDB.closeThread();
        this.chatService.getChatInformationen(this.chatId, 'messages');
        this.chatMessages$ = this.chatService.messages$;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paramMapSubscription) {
      this.paramMapSubscription.unsubscribe();
      this.threadsDB.closeThread();
    }
  }

  addEmoji(event: string) {
    this.emojiService.addEmoji(event, this.chatId, 'messages');
  }

  isPrivateChat(): boolean {
    return (
      this.usersService.currentUserSig()?.userName ===
      this.chatService.chatPartner.name
    );
  }
}
