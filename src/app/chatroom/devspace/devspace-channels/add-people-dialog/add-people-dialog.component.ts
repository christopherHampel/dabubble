import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-people-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-people-dialog.component.html',
  styleUrl: './add-people-dialog.component.scss'
})
export class AddPeopleDialogComponent {
  @Input() dialogOpen: boolean = false;
  selectedOption: string = '';
}
