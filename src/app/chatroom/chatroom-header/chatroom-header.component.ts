import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatroom-header',
  imports: [CommonModule],
  templateUrl: './chatroom-header.component.html',
  styleUrl: './chatroom-header.component.scss'
})
export class ChatroomHeaderComponent {
  private auth = inject(AuthService)
  dropdown: boolean = false;

  constructor(private router: Router) { }

  openDropdown() {
    this.dropdown = true;
  }

  closeDropdown() {
    this.dropdown = false;
  }

  onLogout() {
    this.auth.logout();
    this.router.navigateByUrl('/register/login');
  }
}
