import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { CoreModule } from './core/core-module';
import { AuthModule } from './auth/auth-module';
import { FeaturesModule } from './features/features-module';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingSpinner } from './core/components/loading-spinner/loading-spinner';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    AuthModule,
    FeaturesModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinner
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true }
  ],
  bootstrap: [App]
})
export class AppModule { }
