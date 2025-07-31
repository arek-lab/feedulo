import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthComponent } from './auth/auth.component';
import { SettingsComponent } from './settings/settings.component';
import { HistoryComponent } from './history/history.component';
import { authGuard } from './auth/auth.guard';
import { ChatResponseComponent } from './chat-response/chat-response.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'feedback',
    component: ChatResponseComponent,
    canActivate: [authGuard],
  },
  { path: 'auth/:type', component: AuthComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'history', component: HistoryComponent },
];
