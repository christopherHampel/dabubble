import { Component, effect, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatsService } from '../../services/message/chats.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { UserProfile } from '../../interfaces/userProfile';

@Component({
  selector: 'app-user-profil',
  imports: [
    CommonModule
  ],
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.scss'
})
export class UserProfilComponent {
  chatService = inject(ChatsService);
  usersDb = inject(UsersDbService);
  chatPartnerSig = signal<UserProfile>({} as UserProfile);
  edit: boolean = false;
  @Input() useAs: 'view' | 'edit' = 'view';
  @Input() chatData: any;
  @Input() dialog: boolean = false;

  images = [
    '/img/elias_neumann.png',
    '/img/elise_roth.png',
    '/img/frederik_beck.png',
    '/img/noah_braun.png',
    '/img/sofia_müller.png',
    '/img/steffen_hoffmann.png'
  ]

  selectedImage = this.images[0];

  constructor() {
    effect(() => {
      console.log(this.chatService.chatPartnerId);
      if (this.chatService.chatPartner) {
        this.usersDb.subUser(this.chatService.chatPartner.id, (updateUser) => {
          this.chatPartnerSig.set(updateUser);
        });
      }
    })
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
  }
}
