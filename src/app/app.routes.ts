import { Routes } from '@angular/router';
import { authGuard, loginGuard } from './guards/auth.guard';
import { profileGuard } from './guards/profile.guard';

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
        path: 'create-profile',
        loadComponent: () => import('./page/create-profile/create-profile').then((m) => m.CreateProfileComponent),
        canActivate: [authGuard],
    },
    {
        path: 'game',
        loadComponent: () => import('./page/game/game').then((m) => m.GameComponent),
        canActivate: [profileGuard],
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'home',
    },
];
