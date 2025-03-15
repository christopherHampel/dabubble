import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-overlay-userfeedback',
  imports: [ CommonModule ],
  templateUrl: './overlay-userfeedback.component.html',
  styleUrl: './overlay-userfeedback.component.scss'
})
export class OverlayUserfeedbackComponent {

  constructor(private authService: AuthService) {}

  get feedback(): boolean {
    return this.authService.feedback();
  }

  get feedbackMessage(): string {
    return this.authService.feedbackMessage();
  }

}
