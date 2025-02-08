import { Component } from '@angular/core';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-default',
  imports: [ TextareaComponent, CommonModule],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss'
})
export class DefaultComponent {

}
