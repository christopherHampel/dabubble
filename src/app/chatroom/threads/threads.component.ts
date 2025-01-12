import { Component } from '@angular/core';
import { SingleMessageComponent } from '../messages/single-message/single-message.component';
import { TextareaComponent } from '../../shared/textarea/textarea.component';

@Component({
  selector: 'app-threads',
  imports: [TextareaComponent, SingleMessageComponent],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss'
})
export class ThreadsComponent {

}
