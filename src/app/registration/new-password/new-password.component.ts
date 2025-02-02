import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, confirmPasswordReset, verifyPasswordResetCode } from '@angular/fire/auth';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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
    private auth: Auth
  ) {
    this.loginFormPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
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
      alert('Passwort erfolgreich geändert.');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Fehler beim Zurücksetzen des Passworts:', error);
      alert('Fehler: ');
    }
  }
}

