// import { CommonModule } from '@angular/common';
// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { Observable, Subscription } from 'rxjs';
// import { ChatsService } from '../../../services/message/chats.service';
// import { TextareaComponent } from '../../../shared/textarea/textarea.component';
// import { SingleMessageComponent } from '../single-message/single-message.component';

// @Component({
//   selector: 'app-direct-message',
//   imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent],
//   templateUrl: './direct-message.component.html',
//   styleUrl: './direct-message.component.scss',
// })
// export class DirectMessageComponent implements OnInit, OnDestroy {
  
//   chatData: any = { messages: [], chatInfo: {} };
//   chatId: string | null = null;
//   private routeSub: Subscription | undefined;

//   constructor(private route: ActivatedRoute, public chatService: ChatsService) {}

//   ngOnInit(): void {
//     this.routeSub = this.route.params.subscribe(async (params) => {
//       this.chatId = params['chatId'];
//       if (this.chatId) {
//         this.chatService.setCurrentChatId(this.chatId);
//         this.chatService.loadChatData(this.chatId);
//         // console.log('Current Chatid is:', this.chatData.messages)
//       }
//     });

//     this.chatService.chatData$.subscribe((data) => {
//       this.chatData = data;
//     });
//   }

//   ngOnDestroy(): void {
//     this.routeSub?.unsubscribe();
//   }

//   private async loadChatData(chatId: string): Promise<void> {
//     try {
//       this.chatData = await this.chatService.getChatById(chatId);
//     } catch (error) {
//       console.error('Fehler beim Laden der Chat-Daten:', error);
//     }
//   }

//   deleteMessage() {
//     // this.chatService.deleteMessage();
//   }

//   getChatPartnerName(): string {
//     const currentUserId = this.chatService.usersService.currentUserSig()?.id;
//     if (this.chatData) {
//       const otherParticipantId = this.chatData.participants.find((id: string) => id !== currentUserId);
//       if (otherParticipantId) {
//         const otherParticipantDetails = this.chatData.participantsDetails[otherParticipantId];
//         return otherParticipantDetails ? otherParticipantDetails.name : 'Unbekannter Teilnehmer';
//       }
//     }
//     return 'Unbekannter Teilnehmer';
//   }

//   getChatPartnerAvatar(): string {
//     const currentUserId = this.chatService.usersService.currentUserSig()?.id;
//     if (this.chatData) {
//       const otherParticipantId = this.chatData.participants.find((id: string) => id !== currentUserId);
//       if (otherParticipantId) {
//         const otherParticipantDetails = this.chatData.participantsDetails[otherParticipantId];
//         return otherParticipantDetails ? otherParticipantDetails.avatar : '/img/empty_profile.png'; // Fallback-Bild
//       }
//     }
//     return '/img/empty_profile.png'; // Fallback-Bild
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SingleMessageComponent } from '../single-message/single-message.component';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent implements OnInit, OnDestroy {
  
  public chatSubscription: Subscription | null = null;
  chatData: any = null;
  chatPartner: { name: string, avatar: string } = { name: '', avatar: '/img/empty_profile.png' };

  constructor(private route: ActivatedRoute, public chatService: ChatsService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const chatId = params.get('id');
      if (chatId) {
        this.chatService.setChatId(chatId);  // Setzt die chatId im Service
      } else {
        console.error('Keine gültige Chat-ID gefunden!');
      }
    });

    this.chatSubscription = this.chatService.chatData$.subscribe((data) => {
      if (data) {
        this.chatData = data;
        this.setChatPartner();
      } else {
        console.error('Keine Chat-Daten gefunden!');
      }
    });
  }

  trackByMessageId(index: number, message: { id: number }): number {
    return message.id;
  }  

  deleteMessage() {
    // this.chatService.deleteMessage();
  }

  ngOnDestroy() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  messagesAvailable(): boolean {
    return this.chatData?.messages?.length > 0;
  }

  checkDate() {
    const lastMessageIndex = this.chatData.messages.length - 1;
    const lastMessageDate = this.chatData.messages[lastMessageIndex].createdAt;

    if (!lastMessageDate) {
      return 'Ungültiges Datum';
    }
    
    const date = lastMessageDate.toDate();
    const currentDate = new Date();

    const dateFormat = {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    const isSameDate =
    date.getFullYear() === currentDate.getFullYear() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getDate() === currentDate.getDate();

    if(isSameDate) {
      return 'Heute';
    } else {
      return date.toLocaleDateString('de-DE', dateFormat);
    }
  }  

  setChatPartner(): void {
    const currentUserId = this.chatService.usersService.currentUserSig()?.id;

    if (this.chatData && this.chatData.participantsDetails) {
      // Finde die ID des anderen Teilnehmers
      const otherParticipantId = this.chatData.participants.find((id: string) => id !== currentUserId);

      if (otherParticipantId) {
        const otherParticipantDetails = this.chatData.participantsDetails[otherParticipantId];
        this.chatPartner = {
          name: otherParticipantDetails ? otherParticipantDetails.name : 'Unbekannter Teilnehmer',
          avatar: otherParticipantDetails ? otherParticipantDetails.avatar : '/img/empty_profile.png',
        };
      }
    }
  }
}