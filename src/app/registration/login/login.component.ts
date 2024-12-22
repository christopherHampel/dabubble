import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule, CommonModule, RouterLink ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.login();
  }

  async register() {
    await this.auth.register("test@yahoo.com", "test123");
    console.log('Register: ', this.auth.userCredential.user.email);
  }

  async login() {
    await this.auth.login("test@yahoo.com", "test123");
    console.log('Login: ', this.auth.userCredential.user.uid);
  }

  async logout() {
    await this.auth.logout();
    console.log('Logout: ', this.auth.userCredential.user.email);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formularwert:', this.loginForm.value);
    } else {
      console.log('Formular ist ungültig');
    }
  }
}
