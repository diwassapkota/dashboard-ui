import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturesRoutingModule } from './features-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { Reports } from './reports/reports';
import { Chat } from './chat/chat';
import { Query } from './query/query';
import { Settings } from './settings/settings';


@NgModule({
  declarations: [
    Dashboard,
    Reports,
    Chat,
    Query,
    Settings
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    FormsModule
  ]
})
export class FeaturesModule { }
