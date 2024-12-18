import { Routes } from '@angular/router';
import { LoginComponent } from './registration/login/login.component';
import { CreateAccountComponent } from './registration/create-account/create-account.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'createNewAccount', component: CreateAccountComponent },
];
