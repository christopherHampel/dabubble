import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserRegister } from '../../interfaces/userRegister';

@Component({
  selector: 'app-choose-avatar',
  imports: [ RouterLink ],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss'
})
export class ChooseAvatarComponent {
  currentAvatar:string = '/img/empty_profile.png';
  auth = inject(AuthService);
  userName: string = '';
  email: string = '';
  password: string = '';

  avatars: string[] = [
    '/img/elias_neumann.png',
    '/img/elise_roth.png',
    '/img/frederik_beck.png',
    '/img/noah_braun.png',
    '/img/sofia_müller.png',
    '/img/steffen_hoffmann.png',
  ];

  constructor(private router: Router) { 
    this.setNavParam();
  }

  chooseAvatar(index:number) {
    this.currentAvatar = this.avatars[index];
  }

  setNavParam() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as UserRegister | undefined;

    if(state) {
      this.userName = state.userName,
      this.email = state.email,
      this.password = state.password
    } else {
      this.router.navigateByUrl('/register/create-account');
    }
  }

  onRegister() {
    this.auth.register(this.userName, this.email, this.password, this.currentAvatar)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/register/login');
        },
        error: (err) => {
          this.router.navigateByUrl('/register/create-account');
        }
      });
  }

}
