import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersDbService } from '../../services/usersDb/users-db.service';

@Component({
  selector: 'app-user-view-small',
  imports: [
    CommonModule
  ],
  templateUrl: './user-view-small.component.html',
  styleUrl: './user-view-small.component.scss',

})
export class UserViewSmallComponent {
  usersDb = inject(UsersDbService);

  @Input() selectedUserId: string = '';
  @Input() user: any;
  @Input() cursorDefault: boolean = false;

  setCursorDefault(userId: string) {
    return userId === this.usersDb.currentUser?.id && this.cursorDefault;
  }
}
