import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

/**
 * Guard para la página de login
 * Si el usuario ya está autenticado → redirige a /home
 * Si no está autenticado → permite acceso a login
 */
export const loginGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.user()) {
        // Usuario autenticado → ir a home (allí se decide si crear perfil o ir a jugar)
        router.navigate(['/home']);
        return false;
    }

    return true;
};

/**
 * Guard para home
 * Si no está autenticado → redirige a /login
 * Si está autenticado → permite acceso (home maneja si tiene o no perfil)
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.user()) {
        router.navigate(['/login']);
        return false;
    }

    return true;
};

/**
 * Guard para game
 * Si no está autenticado → redirige a /login
 * Si está autenticado pero no tiene perfil → redirige a /home
 * Si está autenticado y tiene perfil → permite acceso
 */
export const gameGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const profileService = inject(ProfileService);
    const router = inject(Router);

    if (!authService.user()) {
        router.navigate(['/login']);
        return false;
    }

    // Intentar obtener el perfil del caché primero, luego cargar si es necesario
    // El loadProfile() ya maneja el caché internamente
    const perfil = await profileService.loadProfile();

    if (!perfil) {
        // No tiene perfil → ir a home para crearlo
        router.navigate(['/home']);
        return false;
    }

    return true;
};
