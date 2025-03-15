import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { interval, map, take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { OverlayUserfeedbackComponent } from '../shared/overlay-userfeedback/overlay-userfeedback.component';

@Component({
  selector: 'app-registration',
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    OverlayUserfeedbackComponent,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  standalone: true,
})
export class RegistrationComponent {
  feedback: boolean = true;

  images: string[] = [
    '/img/D.png',
    '/img/A.png',
    '/img/B.png',
    '/img/u.png',
    // '/img/small_b_white.png',
    // '/img/small_b_white.png',
    '/img/small_b1.png',
    '/img/small_b2.png',
    '/img/l.png',
    '/img/e.png',
  ];

  currentImages: string[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.getTypewriterEffect(this.images, 200).subscribe((images) => {
      this.currentImages = images;
    });
  }

  getTypewriterEffect(images: string[], speed: number = 200) {
    return interval(speed).pipe(
      map((index) => images.slice(0, index + 1)),
      take(images.length)
    );
  }

  currentRoute() {
    return this.router.url === '/register/login';
  }
}
