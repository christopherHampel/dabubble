import { Component, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  loginFormEmail: FormGroup;
  loginFormPassword: FormGroup;
  sendMail: boolean = false;
  auth = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.loginFormEmail = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.loginFormPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    return control.get('password')?.value === control.get('confirmPassword')?.value
    ? null
    : { missmatch: true };
  }

  onSendMail() {
    this.sendMail = true
    console.log('Email senden!');
    this.auth.resetPassword(this.loginFormEmail.value.email);
  }

  changePassword() {
    console.log('Password geändert!');
  }

}