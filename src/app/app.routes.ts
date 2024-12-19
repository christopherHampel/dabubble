import { Routes } from '@angular/router';
import { LoginComponent } from './registration/login/login.component';
import { CreateAccountComponent } from './registration/create-account/create-account.component';
import { ResetPasswordComponent } from './registration/reset-password/reset-password.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'createNewAccount', component: CreateAccountComponent },
];
