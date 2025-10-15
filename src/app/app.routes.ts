import { Routes } from '@angular/router';
import { authGuard, loginGuard, gameGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./page/login/login').then((m) => m.LoginComponent),
        canActivate: [loginGuard],
    },
    {
        path: 'home',
        loadComponent: () => import('./page/home/home').then((m) => m.HomeComponent),
        canActivate: [authGuard],
    },
    {
        path: 'game',
        loadComponent: () => import('./page/game/game').then((m) => m.GameComponent),
        canActivate: [gameGuard],
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
