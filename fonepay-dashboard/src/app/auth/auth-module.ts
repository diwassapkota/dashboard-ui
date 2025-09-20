import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';
import { ReactiveFormsModule } from '@angular/forms';
import { Register } from './register/register';
import { ForgotPassword } from './forgot-password/forgot-password';


@NgModule({
  declarations: [
    Login
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    Register,
    ForgotPassword
  ]
})
export class AuthModule { }
