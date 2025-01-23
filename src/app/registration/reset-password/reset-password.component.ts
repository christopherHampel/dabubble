import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  loginFormEmail: FormGroup;

  constructor(private fb: FormBuilder, private auth: Auth) {
    this.loginFormEmail = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  async onSendMail() {
    if (this.loginFormEmail.invalid) return;

    const email = this.loginFormEmail.value.email;
    try {
      await sendPasswordResetEmail(this.auth, email);
      alert('E-Mail wurde gesendet.');
    } catch (error) {
      console.error('Fehler beim Senden der E-Mail:', error);
      alert('Fehler beim Senden der E-Mail.');
    }
  }
}
