import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';
import { ReactiveFormsModule } from '@angular/forms';
import { Register } from './register/register';


@NgModule({
  declarations: [
    Login,
    Register
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
