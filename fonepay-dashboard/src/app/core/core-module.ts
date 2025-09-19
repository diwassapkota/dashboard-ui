import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Layout } from './components/layout/layout';
import { Header } from './components/header/header';
import { LoadingSpinner } from './components/loading-spinner/loading-spinner';

@NgModule({
  declarations: [
    Layout,
    Header,
    LoadingSpinner
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    Layout,
    Header,
    LoadingSpinner
  ]
})
export class CoreModule { }
