import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UserRegister } from '../../interfaces/userRegister';

@Component({
  selector: 'app-create-account',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  auth = inject(AuthService);


  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^\S+\s\S+$/)
      ]],      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{6,}$/)
      ]],
      privacy: [false, [Validators.requiredTrue]]
    });
  }
  

  goToAvatar() {
    const rawForm = this.loginForm.getRawValue();
    const state: UserRegister = {
        id: '',
        userName: rawForm.name,
        email: rawForm.email,
        password: rawForm.password,
        avatar: null
    }
    this.router.navigate(['/register/choose-avatar'], { state });
  }

  getUser() {
    if (this.loginForm.valid) {
      this.goToAvatar();
    } else {
      console.log('Formular ist ungültig');
    }
  }

}
