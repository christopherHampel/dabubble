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
  loginForm: FormGroup;
  signOut = false;
  errorMessage: string | null = null;
  auth = inject(AuthService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.auth.currentUserSig.set({
          userName: user.displayName!,
          email: user.email!,
          password: '',
          avatar: user.photoURL
        });
        console.log(this.auth.currentUserSig()?.email + ' Login!');
      } else {
        console.log(this.auth.currentUserSig()?.email + ' Logout!');
        this.auth.currentUserSig.set(null);
      }
    });
  }

  onLogin() {
    const rawForm = this.loginForm.getRawValue();
    this.auth.login(rawForm.email, rawForm.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.errorMessage = err.code;
        }
      });
  }

  onGaestLogin() {
    this.auth.login('gaest@gaest.com', '123456')
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.errorMessage = err.code;
        }
      });
  }

  onLoginWithGoogle() {
    this.auth.loginWithGoogle()
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.errorMessage = err.code;
        }
      });
  }

  onLogout() {
    this.auth.logout();
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
