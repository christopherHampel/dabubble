import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hide-or-show-navbar',
  imports: [CommonModule],
  templateUrl: './hide-or-show-navbar.component.html',
  styleUrl: './hide-or-show-navbar.component.scss'
})
export class HideOrShowNavbarComponent {
  isClosed: boolean = false;
  @Output() navbarClose = new EventEmitter<boolean>();

  closeDevspace() {
      this.isClosed = !this.isClosed;
      this.navbarClose.emit(this.isClosed);
  }
}
