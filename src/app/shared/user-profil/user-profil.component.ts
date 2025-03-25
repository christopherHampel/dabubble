import { Component, effect, EventEmitter, inject, Input, Output, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsService } from '../../services/message/chats.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { UserProfile } from '../../interfaces/userProfile';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-user-profil',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.scss'
})
export class UserProfilComponent {
  chatService = inject(ChatsService);
  usersDb = inject(UsersDbService);
  auth = inject(AuthService);
  chatPartnerSig = signal<UserProfile>({} as UserProfile);
  edit: boolean = false;
  userName: string = '';
  selectedImage: string = '';
  manuelUpdatUser: boolean = false;
  counter: number = 0;

  @Input() userSig?: Signal<UserProfile>;
  @Input() useAs: 'view' | 'edit' | 'info' = 'view';
  @Input() dialogOpen: boolean = false;
  @Output() dialogClose = new EventEmitter<boolean>();

  images = [
    '/img/elias_neumann.png',
    '/img/elise_roth.png',
    '/img/frederik_beck.png',
    '/img/noah_braun.png',
    '/img/sofia_müller.png',
    '/img/steffen_hoffmann.png'
  ]

  constructor(private router: Router) {
    effect(() => {
      this.counter++;
      console.log('NOT view: ', this.counter);

      if (this.manuelUpdatUser) return;

      if (this.userSig && this.useAs !== 'view') {
        this.chatPartnerSig.set(this.userSig());
      }

      this.selectedImage = this.chatPartner.avatar;
    });

    effect(() => {
      this.counter++;
      console.log('IS view: ', this.counter);

      if (this.chatService.chatPartnerId && this.useAs === 'view') {
        this.usersDb.subUser(this.chatService.chatPartner.id, (updateUser) => {
          this.chatPartnerSig.set(updateUser as UserProfile);
        });
      }
    })
  }

  ngOnChanges() {
    this.closeEdit();
  }

  get chatPartner() {
    return this.chatPartnerSig();
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  getPosition(index: number) {
    const angle = (index / this.images.length) * 2 * Math.PI;
    const radius = 140;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
      top: `${x}px`,
      left: `${y}px`,
    };
  }

  openEdit() {
    this.edit = true;
  }

  closeEdit() {
    this.edit = false;
    this.userName = '';
  }

  closeDialog() {
    this.dialogClose.emit(true);
  }

  async selectChat() {
    try {
      const chatId = await this.chatService.setPrivateChat(this.chatPartner, "messages");
      this.chatService.currentChatId = chatId;
      this.router.navigate(['/chatroom', { outlets: { chats: ['direct-message', chatId], thread: null } }]);
    } catch (error) {
      console.error('Fehler beim Erstellen des Chats:', error);
    }
  }

  async updateUser() {
    this.manuelUpdatUser = true;
    if (this.userName === '') this.userName = this.chatPartner.userName;

    await this.auth.updateCurrentUser(this.userName, this.selectedImage);
    this.usersDb.updateCurrentUserProfil(this.userName, this.selectedImage);
    this.chatPartnerSig.update((currentDate) => ({...currentDate, userName: this.userName, avatar: this.selectedImage}));

    this.closeEdit();
    setTimeout(() => this.manuelUpdatUser = false, 500);
  }
}
