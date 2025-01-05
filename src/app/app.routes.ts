import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './registration/login/login.component';
import { CreateAccountComponent } from './registration/create-account/create-account.component';
import { RegistrationComponent } from './registration/registration.component';
import { ChooseAvatarComponent } from './registration/choose-avatar/choose-avatar.component';
import { NgModule } from '@angular/core';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { DirectMessageComponent } from './chatroom/messages/direct-message/direct-message.component';
import { ChannelComponent } from './chatroom/messages/channel/channel.component';
import { ResetPasswordComponent } from './registration/reset-password/reset-password.component';
import { NewPasswordComponent } from './registration/new-password/new-password.component';

export const routes: Routes = [
    {
      path: 'register',
      component: RegistrationComponent,
      children: [
        { path: 'login', component: LoginComponent },
        { path: 'create-account', component: CreateAccountComponent },
        { path: 'choose-avatar', component: ChooseAvatarComponent },
        { path: 'reset-password', component: ResetPasswordComponent },
        { path: 'new-password', component: NewPasswordComponent},
        { path: '', redirectTo: 'login', pathMatch: 'full' }
      ]
    },
    { path: 'chatroom', component: ChatroomComponent,
      children: [
        { path: 'direct-message/:chatId', component: DirectMessageComponent },
        { path: 'channel/:id', component: ChannelComponent }
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