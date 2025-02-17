import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  loginForm: FormGroup;
  signOut = false;
  errorMessage: string | null = null;
  //private auth = inject(AuthService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.auth.currentAuthUser.subscribe((user) => {
      if (user) {
        // this.router.navigateByUrl('/chatroom');
      }
    });
  }

  onLogin() {
    const rawForm = this.loginForm.getRawValue();
    this.auth.login(rawForm.email, rawForm.password)
      .then(() => {
        // this.router.navigateByUrl('/chatroom');
        this.router.navigate(['/chatroom']);
      })

  }

  onGaestLogin() {
    this.auth.login('gaest@gaest.com', '123456')
      .then(() => {
        this.router.navigateByUrl('/chatroom');
      })
  }

  onLoginWithGoogle() {
    this.auth.loginWithGoogle()
      .then(() => {
        this.router.navigateByUrl('/chatroom');
      })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formularwert:', this.loginForm.value);
      this.onLogin();
    } else {
      console.log('Formular ist ungültig');
    }
  }
}
