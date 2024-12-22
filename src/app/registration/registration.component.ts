import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [
    LoginComponent,
    RouterLink
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {

}
