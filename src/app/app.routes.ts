import { Routes } from '@angular/router';

import { AuthComponent } from './auth/auth.component';
import { SettingsComponent } from './settings/settings.component';
import { HistoryComponent } from './history/history.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.compnent';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent, data: { scrollPositionRestoration: 'enabled' } },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'auth/:type', component: AuthComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'history', component: HistoryComponent },
];

// export const routes: Routes = [
//   { path: '', pathMatch: 'full', redirectTo: 'home' },
//   {
//     path: 'home',
//     loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
//     data: { scrollPositionRestoration: 'enabled' },
//   },
//   {
//     path: 'dashboard',
//     loadComponent: () => import('./dashboard/dashboard.compnent').then(m => m.DashboardComponent),
//     canActivate: [authGuard],
//   },
//   {
//     path: 'auth/:type',
//     loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
//   },
//   {
//     path: 'settings',
//     loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
//   },
//   {
//     path: 'history',
//     loadComponent: () => import('./history/history.component').then(m => m.HistoryComponent),
//   },
// ];
