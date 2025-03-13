import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { Router } from '@angular/router';
import { TransparentBackgroundComponent } from '../../shared/transparent-background/transparent-background.component';
import { FormsModule } from '@angular/forms';
import { ChannelsDbService } from '../../services/message/channels-db.service';

@Component({
  selector: 'app-chatroom-header',
  imports: [CommonModule, TransparentBackgroundComponent, FormsModule],
  templateUrl: './chatroom-header.component.html',
  styleUrl: './chatroom-header.component.scss',
})
export class ChatroomHeaderComponent {
  private auth = inject(AuthService);
  usersDb = inject(UsersDbService);
  dropdown: boolean = false;

  // searchText:string = '';

  searchText = signal<string>(''); // Signal für den Suchtext
  results = signal<any[]>([]); // Signal für die Suchergebnisse

  constructor(private router: Router, private channelsDb: ChannelsDbService) { }

  openDropdown() {
    this.dropdown = true;
  }

  closeDropdown(event: boolean) {
    this.dropdown = event;
  }

  onLogout() {
    if (this.usersDb.currentUser) {
      this.usersDb.updateUserStatus(this.usersDb.currentUser.id, false);
      this.usersDb.updateClickStatus(this.usersDb.currentUser.id, false);
      this.auth.logout();
      this.router.navigateByUrl('/register/login');
    }
  }

  searchDevspace(event: Event) {
    const input = event.target as HTMLInputElement;
    this.channelsDb.setSearchText(input.value);
  }
}
