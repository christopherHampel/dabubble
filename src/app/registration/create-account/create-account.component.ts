import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

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
      name: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister() {
    const rawForm = this.loginForm.getRawValue();
    this.auth.register(rawForm.name, rawForm.email, rawForm.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/register/login');
        },
        error: (err) => {
          this.errorMessage = err.code;
        }
      });
  }

  getUser() {
    if (this.loginForm.valid) {
      console.log('Formularwert:', this.loginForm.value);
      this.onRegister();
    } else {
      console.log('Formular ist ungültig');
    }
    this.router.navigate(['/register/choose-avatar']);
  }

}
