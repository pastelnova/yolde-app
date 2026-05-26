import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'articles', pathMatch: 'full' },
  {
    path: 'articles',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'projects/:slug',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'projects/:slug/:section',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'signin',
    loadComponent: () => import('./features/signin/signin').then((m) => m.Signin),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/register/register').then((m) => m.Register),
  },
  {
    path: 'article/new',
    loadComponent: () => import('./features/article-editor/article-editor').then((m) => m.ArticleEditor),
    canActivate: [authGuard],
  },
  {
    path: 'article/:slug',
    loadComponent: () => import('./features/article/article').then((m) => m.ArticleComponent),
  },
  {
    path: 'article/:slug/edit',
    loadComponent: () => import('./features/article-editor/article-editor').then((m) => m.ArticleEditor),
    canActivate: [authGuard],
  },
  {
    path: 'profile/:username',
    loadComponent: () => import('./features/profile/profile').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile/:username/edit',
    loadComponent: () => import('./features/profile-editor/profile-editor').then((m) => m.ProfileEditor),
    canActivate: [authGuard],
  },
];
