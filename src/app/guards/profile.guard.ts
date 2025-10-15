import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';

export const profileGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const profileService = inject(ProfileService);
    const router = inject(Router);

    // Verificar que el usuario esté autenticado
    if (!authService.user()) {
        router.navigate(['/login']);
        return false;
    }

    // Cargar el perfil del usuario
    const profile = await profileService.loadProfile();

    // Si no tiene perfil, redirigir a la página de creación de perfil
    if (!profile) {
        router.navigate(['/create-profile']);
        return false;
    }

    return true;
};
