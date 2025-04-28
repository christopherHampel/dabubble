import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { UserRegister } from '../../interfaces/userRegister';
import { UserProfile } from '../../interfaces/userProfile';

@Component({
  selector: 'app-choose-avatar',
  imports: [RouterLink],
  templateUrl: './choose-avatar.component.html',
  styleUrl: './choose-avatar.component.scss',
})
export class ChooseAvatarComponent {
  private auth = inject(AuthService);
  private usersDb = inject(UsersDbService);
  currentAvatar: string = '/img/empty_profile.png';
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

  constructor(private router: Router, private authService: AuthService) {
    this.setNavParam();
  }

  chooseAvatar(index: number) {
    this.currentAvatar = this.avatars[index];
  }

  setNavParam() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as UserRegister | undefined;

    if (state) {
      (this.userName = state.userName),
        (this.email = state.email),
        (this.password = state.password);
    } else {
      this.router.navigateByUrl('/register/create-account');
    }
  }

  async onRegister() {
    try {
      const uid = await this.auth.register(this.userName, this.email, this.password, this.currentAvatar);
      await this.saveUser(uid);
  
      this.authService.userFeedback('Konto erfolgreich erstellt!');
      
      setTimeout(() => {
        this.auth.logout();
        this.router.navigateByUrl('/register/login');
      }, 1000);
  
    } catch (error) {
      this.router.navigateByUrl('/register/create-account');
    }
  }
  

  async saveUser(uid: string) {
    let user: UserProfile = {
      id: uid,
      userName: this.userName,
      email: this.email,
      avatar: this.currentAvatar,
      active: false,
      channelFriendHighlighted: '',
      directmessagesWith: [],
    };
    await this.usersDb.addUser(user);
  }
}
