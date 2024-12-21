import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { interval, map, take } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [
    RouterOutlet, RouterLink, AsyncPipe, CommonModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  standalone: true
})
export class RegistrationComponent {

  constructor(private router: Router) {}

  typedText$ = this.getTypewriterEffect('DABubble', 200).pipe(
    map((text) => text)
  );

  getTypewriterEffect(word: string, speed: number = 200) {
    return interval(speed).pipe(
      map((x) => word.substring(0, x + 1)),
      take(word.length)
    );
  }

  currentRoute() {
    return this.router.url === '/register/login';
  }
}
