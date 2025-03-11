import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profil',
  imports: [
    CommonModule
  ],
  templateUrl: './user-profil.component.html',
  styleUrl: './user-profil.component.scss'
})
export class UserProfilComponent {
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

  selectImage(img: string) {
    this.selectedImage = img;
  }

  getPosition(index: number) {
    const angle = (index / this.images.length) * 2 * Math.PI;
    const radius = 130;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return {
      top: `${x}px`,
      left:`${y}px`
    };
  }
}
