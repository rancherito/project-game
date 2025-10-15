import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service';
import { CreateProfileDto } from '../../models/profile.model';

@Component({
    selector: 'app-create-profile',
    imports: [FormsModule],
    templateUrl: './create-profile.html',
    styleUrl: './create-profile.scss',
})
export class CreateProfileComponent {
    private profileService = inject(ProfileService);
    private router = inject(Router);

    formData: { apodo: string; grado: number | null; avatar_url: string } = {
        apodo: '',
        grado: null,
        avatar_url: '',
    };

    loading = signal(false);
    error = signal<string | null>(null);

    async onSubmit() {
        // Validar que el grado esté seleccionado
        if (!this.formData.grado || this.formData.grado < 1 || this.formData.grado > 6) {
            this.error.set('Por favor selecciona tu grado escolar');
            return;
        }

        // Validar apodo
        if (!this.formData.apodo || this.formData.apodo.trim().length < 3) {
            this.error.set('El apodo debe tener al menos 3 caracteres');
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        try {
            await this.profileService.createProfile({
                apodo: this.formData.apodo.trim(),
                grado: this.formData.grado as 1 | 2 | 3 | 4 | 5 | 6,
                avatar_url: this.formData.avatar_url || undefined,
            });

            // Redirigir al juego después de crear el perfil
            this.router.navigate(['/game']);
        } catch (err: any) {
            console.error('Error creating profile:', err);

            if (err.code === '23505') {
                // Duplicate key error
                this.error.set('Este apodo ya está en uso. Por favor elige otro.');
            } else {
                this.error.set('Error al crear el perfil. Por favor intenta de nuevo.');
            }
        } finally {
            this.loading.set(false);
        }
    }
}
