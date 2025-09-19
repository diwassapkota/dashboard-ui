import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Header } from './components/header/header';
import { Sidebar } from './components/sidebar/sidebar';



@NgModule({
  declarations: [
    Layout,
    Header,
    Sidebar
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    Layout,
    Header,
    Sidebar
  ]
})
export class CoreModule { }
