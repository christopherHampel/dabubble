import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { interval, map, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [
    RouterOutlet, RouterLink, AsyncPipe
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  standalone: true
})
export class RegistrationComponent {

  typedText$ = this.getTypewriterEffect('DABubble', 200).pipe(
    map((text) => text)
  );

  getTypewriterEffect(word: string, speed: number = 200) {
    return interval(speed).pipe(
      map((x) => word.substring(0, x + 1)),
      take(word.length)
    );
  }
}
