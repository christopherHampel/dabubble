import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, confirmPasswordReset, verifyPasswordResetCode } from '@angular/fire/auth';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent implements OnInit {
  loginFormPassword: FormGroup;
  private oobCode: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: Auth,
    private authService: AuthService
  ) {
    this.loginFormPassword = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }
  

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['oobCode']) {
        this.oobCode = params['oobCode'];
        verifyPasswordResetCode(this.auth, this.oobCode).catch(() => {
          alert('Der Link ist ungültig oder abgelaufen.');
          this.router.navigate(['/reset-password']);
        });
      }
    });
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  async changePassword() {
    if (this.loginFormPassword.invalid) return;

    try {
      await confirmPasswordReset(this.auth, this.oobCode, this.loginFormPassword.value.password);
      this.authService.userFeedback('Passwort erfolgreich geändert.');
      setTimeout( () => {
        this.router.navigate(['/login']);
      }, 1500);
    } catch (error) {
      console.error('Fehler beim Zurücksetzen des Passworts:', error);
    }
  }

  getPasswordErrorMessage() {
    const passwordControl = this.loginFormPassword.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Das Passwort ist erforderlich.';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Das Passwort muss mindestens 6 Zeichen lang sein.';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'Das Passwort muss mindestens einen Großbuchstaben, einen Kleinbuchstaben und ein Sonderzeichen enthalten.';
    }
    return 'Ihre Kennwörter stimmen nicht überein.';
  }
  
}

