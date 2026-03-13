import { Routes } from '@angular/router';

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
    path: 'articles/:slug',
    loadComponent: () => import('./features/article/article').then((m) => m.ArticleComponent),
  },
];
