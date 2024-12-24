import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './registration/login/login.component';
import { CreateAccountComponent } from './registration/create-account/create-account.component';
import { ResetPasswordComponent } from './registration/reset-password/reset-password.component';
import { RegistrationComponent } from './registration/registration.component';
import { ChooseAvatarComponent } from './registration/choose-avatar/choose-avatar.component';
import { NgModule } from '@angular/core';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { DirectMessageComponent } from './chatroom/messages/direct-message/direct-message.component';
import { MessagesComponent } from './chatroom/messages/messages.component';

export const routes: Routes = [
    {
      path: 'register',
      component: RegistrationComponent,
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'create-account', component: CreateAccountComponent },
        { path: 'choose-avatar', component: ChooseAvatarComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: '', redirectTo: 'login', pathMatch: 'full' }
      ]
    },
    { path: 'chatroom', component: ChatroomComponent,
      children: [
        { path: 'direct-message/:id', component: DirectMessageComponent }
      ]
     },
    { path: '', redirectTo: 'register', pathMatch: 'full' },
    { path: '**', redirectTo: 'register' }
    ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [ RouterModule ]
  })
  export class AppRoutingModule {  }