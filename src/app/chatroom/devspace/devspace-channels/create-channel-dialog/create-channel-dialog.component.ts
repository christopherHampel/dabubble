import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-channel-dialog',
  imports: [CommonModule],
  templateUrl: './create-channel-dialog.component.html',
  styleUrl: './create-channel-dialog.component.scss'
})
export class CreateChannelDialogComponent {
  @Input() dialogOpen: boolean = false;

}
