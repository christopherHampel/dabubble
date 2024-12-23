import { Component } from '@angular/core';
import { DirectMessageComponent } from "./direct-message/direct-message.component";

@Component({
  selector: 'app-messages',
  imports: [DirectMessageComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {

}
