import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Header } from './components/header/header';
@NgModule({
  declarations: [
    Layout,
    Header
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    Layout,
    Header
  ]
})
export class CoreModule { }
