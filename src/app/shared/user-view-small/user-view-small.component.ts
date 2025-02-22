import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-view-small',
  imports: [
    CommonModule
  ],
  templateUrl: './user-view-small.component.html',
  styleUrl: './user-view-small.component.scss',

})
export class UserViewSmallComponent {
  @Input() selectedUserId: string = '';
  @Input() user: any;
}
