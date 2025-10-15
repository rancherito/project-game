import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class LoginComponent {
    authService = inject(AuthService);
    private profileService = inject(ProfileService);
    private router = inject(Router);

    async signInWithGoogle() {
        try {
            await this.authService.signInWithGoogle();

            // Después de iniciar sesión, verificar si tiene perfil
            const perfil = await this.profileService.loadProfile();

            if (perfil) {
                // Si ya tiene perfil, redirigir directamente al juego
                this.router.navigate(['/game']);
            } else {
                // Si no tiene perfil, redirigir a crear perfil
                this.router.navigate(['/create-profile']);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    }
}
