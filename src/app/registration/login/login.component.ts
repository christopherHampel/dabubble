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
  standalone: true,
})
export class LoginComponent {
  private auth = inject(AuthService);
  loginForm: FormGroup;
  signOut = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // ngOnInit() {
  //   this.auth.currentAuthUser.subscribe((user) => {
  //     if (user) {
  //       // this.router.navigateByUrl('/chatroom');
  //     }
  //   });
  // }

  onLogin() {
    const rawForm = this.loginForm.getRawValue();
    this.auth
    .login(rawForm.email, rawForm.password)
    .then(() => {
      this.forwardToChatroom();
    })
    .catch( () => {
      console.log('Fehlerhafte Anmeldedaten');
      this.loginForm.setErrors({ invalidCredentials: true });
    })
  }

  onGaestLogin() {
    this.auth.login('gaest@gaest.com', '123456').then(() => {
      this.forwardToChatroom();
    });
  }

  onLoginWithGoogle(e: any) {
    e.preventdefault();
    this.auth.loginWithGoogle().then(() => {
      this.forwardToChatroom();
    });
  }

  forwardToChatroom() {
    this.authService.userFeedback('Anmelden');
    setTimeout(() => {
      this.router.navigate(['/chatroom']);
    }, 1500);
  }
}
