import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
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
];
