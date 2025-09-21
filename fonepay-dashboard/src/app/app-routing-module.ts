import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Layout } from './core/components/layout/layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Reports } from './features/reports/reports';
import { Chat } from './features/chat/chat';
import { Query } from './features/query/query';
import { Settings } from './features/settings/settings';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
  {
    path: 'app',
    component: Layout,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'reports', component: Reports },
      { path: 'chat', component: Chat },
      { path: 'query', component: Query },
      { path: 'settings', component: Settings },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
