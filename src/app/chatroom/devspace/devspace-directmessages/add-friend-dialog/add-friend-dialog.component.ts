import { Component, inject } from '@angular/core';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { DirectMessageComponent } from '../../../messages/direct-message/direct-message.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-friend-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule
  ],
  templateUrl: './add-friend-dialog.component.html',
  styleUrl: './add-friend-dialog.component.scss'
})
export class AddFriendDialogComponent {
   readonly dialogRef = inject(MatDialogRef<DirectMessageComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }
}
