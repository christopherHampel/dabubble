import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { Router } from '@angular/router';
import { TransparentBackgroundComponent } from '../../shared/transparent-background/transparent-background.component';

@Component({
  selector: 'app-chatroom-header',
  imports: [CommonModule, TransparentBackgroundComponent],
  templateUrl: './chatroom-header.component.html',
  styleUrl: './chatroom-header.component.scss'
})
export class ChatroomHeaderComponent {
  private auth = inject(AuthService)
  usersDb = inject(UsersDbService)
  dropdown: boolean = false;

  constructor(private router: Router) { }

  openDropdown() {
    this.dropdown = true;
  }

  closeDropdown(event: boolean) {
    this.dropdown = event;
  }

  getCurrentUser() {
    return this.usersDb.currentUser;
  }

  onLogout() {
    this.usersDb.updateUserStatus(this.usersDb.currentUser!.id, false);
    this.auth.logout();
    this.router.navigateByUrl('/register/login');
  }
}
