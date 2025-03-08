import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserViewSmallComponent } from "../../../shared/user-view-small/user-view-small.component";
import { UsersDbService } from '../../../services/usersDb/users-db.service';


@Component({
  selector: 'app-default',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextareaComponent, CommonModule, FormsModule, UserViewSmallComponent],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
})
export class DefaultComponent {

  isLoaded = false;
  userList: boolean = false;
  searchText:string ='';
  filteredUser: any[] = [];

  constructor(private userService: UsersDbService) {}

  ngOnInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 50);
  }

  searchChat() {
    if (this.searchText == '#') {
        console.log('Piep');
    } else if (this.searchText.startsWith('@')) {
        this.userList = true;
        this.searchUserList();
        console.log(this.filteredUser);
    } else {
        this.userList = false;
    }
}

searchUserList() {
  const query = this.searchText.substring(1); 

  this.filteredUser = this.userService.userList.filter(user => 
      user.userName.includes(query)
  );
}
}
