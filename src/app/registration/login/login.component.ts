import {CommonModule} from '@angular/common';
import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {UserProfile} from '../../interfaces/userProfile';
import {UsersDbService} from '../../services/usersDb/users-db.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private usersDb = inject(UsersDbService);
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

  onLogin() {
    const rawForm = this.loginForm.getRawValue();
    this.auth
      .login(rawForm.email, rawForm.password)
      .then(() => {
        this.forwardToChatroom();
      })
      .catch(() => {
        console.log('Fehlerhafte Anmeldedaten');
        this.loginForm.setErrors({invalidCredentials: true});
      })
  }

  onGaestLogin() {
    this.auth.login('gaest@gaest.com', '123456Aa!').then(() => {
      this.forwardToChatroom();
    });
  }

  // onLoginWithGoogle() {
  //   this.auth.loginWithGoogle()
  //     .then(async () => {
  //       this.auth.currentAuthUser.subscribe(async (user) => {
  //         if (user) {
  //           await this.newUser(user);
  //           this.forwardToChatroom();
  //         }
  //       })
  //     });
  // }

  onLoginWithGoogle() {
    this.auth.loginWithGoogle()
      .then(() => {
        this.auth.currentAuthUser.pipe(take(1)).subscribe(async (user) => {
          if (user) {
            const existingUser = await this.usersDb.getUserById(user.uid);
            if (!existingUser) {
              await this.newUser(user);
            }
            this.forwardToChatroom();
          }
        });
      });
  }

  forwardToChatroom() {
    this.authService.userFeedback('Anmelden');
    setTimeout(() => {
      this.router.navigate(['/chatroom']);
    }, 1500);
  }

  async newUser(authUser: any) {
    let user: UserProfile = {
      id: authUser.uid,
      userName: 'Wurst',
      email: authUser.email,
      avatar: '/img/empty_profile.png',
      active: false,
      channelFriendHighlighted: '',
      directmessagesWith: [],
    };
    await this.usersDb.addUser(user);
  }
}
