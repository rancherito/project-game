import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.user()) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};

export const loginGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.user()) {
        return true;
    }

    router.navigate(['/home']);
    return false;
};
