import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-choose-avatar',
  imports: [ RouterLink ],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {

  currentAvatar:string = '/img/empty_profile.png';

  avatars: string[] = [
    '/img/elias_neumann.png',
    '/img/elise_roth.png',
    '/img/frederik_beck.png',
    '/img/noah_braun.png',
    '/img/sofia_müller.png',
    '/img/steffen_hoffmann.png',
  ];

  chooseAvatar(index:number) {
    this.currentAvatar = this.avatars[index];
  }
}
