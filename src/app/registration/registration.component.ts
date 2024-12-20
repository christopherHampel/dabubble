import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-registration',
  imports: [
    LoginComponent
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  standalone: true
})
export class RegistrationComponent {

}
