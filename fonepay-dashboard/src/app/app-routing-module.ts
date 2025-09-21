import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './core/components/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Reports } from './features/reports/reports';
import { Chat } from './features/chat/chat';
import { Query } from './features/query/query';
import { Settings } from './features/settings/settings';
import { Login } from './auth/login/login';

const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: 'app',
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'reports', component: Reports },
      { path: 'chat', component: Chat },
      { path: 'query', component: Query },
      { path: 'settings', component: Settings },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
