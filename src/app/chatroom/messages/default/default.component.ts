import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SearchFieldComponent } from "./search-field/search-field.component";

@Component({
  selector: 'app-default',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TextareaComponent,
    SearchFieldComponent
],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
})
export class DefaultComponent {

}
