import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
    selector: 'app-home',
    imports: [FormsModule],
    template: `
        @if (cargando()) {
            <div class="contenedor-carga">
                <p>Cargando...</p>
            </div>
        } @else {
            <!-- Formulario de creación de perfil -->
            <div class="contenedor-perfil">
                <div class="tarjeta-perfil">
                    <h1>Crea tu Perfil</h1>
                    <p class="subtitulo">Completa tu información para comenzar a jugar</p>

                    <form class="formulario-perfil" (ngSubmit)="crearPerfil()">
                        <div class="grupo-formulario">
                            <label for="apodo">Apodo *</label>
                            <input type="text" id="apodo" [(ngModel)]="datosFormulario.apodo" name="apodo" placeholder="Tu apodo en el juego" required minlength="3" maxlength="20" />
                        </div>

                        <div class="grupo-formulario">
                            <label for="grado">Grado Escolar *</label>
                            <select id="grado" [(ngModel)]="datosFormulario.grado" name="grado" required>
                                <option [ngValue]="null" disabled>Selecciona tu grado</option>
                                <option [ngValue]="1">1° Primaria</option>
                                <option [ngValue]="2">2° Primaria</option>
                                <option [ngValue]="3">3° Primaria</option>
                                <option [ngValue]="4">4° Primaria</option>
                                <option [ngValue]="5">5° Primaria</option>
                                <option [ngValue]="6">6° Primaria</option>
                            </select>
                        </div>

                        <div class="grupo-formulario">
                            <label for="avatar">URL del Avatar (opcional)</label>
                            <input type="url" id="avatar" [(ngModel)]="datosFormulario.avatar_url" name="avatar" placeholder="https://ejemplo.com/avatar.jpg" />
                        </div>

                        @if (error()) {
                            <div class="mensaje-error">{{ error() }}</div>
                        }

                        <button type="submit" class="boton-enviar" [disabled]="procesando()">
                            @if (procesando()) {
                                <span>Creando...</span>
                            } @else {
                                <span>Crear Perfil</span>
                            }
                        </button>
                    </form>

                    <button class="boton-cerrar-sesion" (click)="cerrarSesion()">Cerrar Sesión</button>
                </div>
            </div>
        }
    `,
    styles: `
        .contenedor-carga {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #000;
            color: #fff;
        }

        // Estilos para formulario de creación de perfil
        .contenedor-perfil {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #000;
            padding: 2rem;
        }

        .tarjeta-perfil {
            background: #fff;
            padding: 3rem 2rem;
            border-radius: 0;
            max-width: 500px;
            width: 100%;
            border: 2px solid #000;
        }

        h1 {
            margin: 0 0 0.5rem;
            font-size: 2rem;
            color: #000;
            text-align: center;
            font-weight: 700;
        }

        .subtitulo {
            margin: 0 0 2rem;
            color: #666;
            font-size: 1rem;
            text-align: center;
        }

        .formulario-perfil {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 1rem;
        }

        .grupo-formulario {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            label {
                color: #000;
                font-weight: 600;
                font-size: 0.95rem;
            }

            input,
            select {
                padding: 0.875rem;
                border: 2px solid #000;
                border-radius: 0;
                font-size: 1rem;
                background: #fff;

                &:focus {
                    outline: none;
                    border-color: #666;
                }
            }

            select {
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23000' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 1rem center;
                padding-right: 2.5rem;
            }
        }

        .mensaje-error {
            padding: 1rem;
            background: #fff;
            color: #000;
            border: 2px solid #000;
            border-radius: 0;
            font-size: 0.9rem;
            text-align: center;
            font-weight: 600;
        }

        .boton-enviar {
            width: 100%;
            padding: 1rem;
            background: #000;
            color: #fff;
            border: 2px solid #000;
            border-radius: 0;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover:not(:disabled) {
                background: #fff;
                color: #000;
            }

            &:active:not(:disabled) {
                transform: scale(0.98);
            }

            &:disabled {
                background: #666;
                border-color: #666;
                cursor: not-allowed;
            }
        }

        .boton-cerrar-sesion {
            width: 100%;
            padding: 0.75rem;
            background: #fff;
            color: #000;
            border: 2px solid #000;
            border-radius: 0;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background: #000;
                color: #fff;
            }

            &:active {
                transform: scale(0.98);
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
    authService = inject(AuthService);
    profileService = inject(ProfileService);
    private router = inject(Router);

    // Estado del componente
    cargando = signal(true);
    procesando = signal(false);
    error = signal<string | null>(null);

    // Datos del formulario
    datosFormulario: { apodo: string; grado: number | null; avatar_url: string } = {
        apodo: '',
        grado: null,
        avatar_url: '',
    };

    async ngOnInit() {
        await this.verificarPerfil();
    }

    async verificarPerfil() {
        this.cargando.set(true);
        const perfil = await this.profileService.loadProfile();

        if (perfil) {
            // Si ya tiene perfil, redirigir inmediatamente a game
            this.router.navigate(['/game']);
            return;
        }

        // No tiene perfil, mostrar formulario
        this.cargando.set(false);
    }

    async crearPerfil() {
        // Validar grado
        if (!this.datosFormulario.grado || this.datosFormulario.grado < 1 || this.datosFormulario.grado > 6) {
            this.error.set('Por favor selecciona tu grado escolar');
            return;
        }

        // Validar apodo
        if (!this.datosFormulario.apodo || this.datosFormulario.apodo.trim().length < 3) {
            this.error.set('El apodo debe tener al menos 3 caracteres');
            return;
        }

        this.procesando.set(true);
        this.error.set(null);

        try {
            await this.profileService.createProfile({
                apodo: this.datosFormulario.apodo.trim(),
                grado: this.datosFormulario.grado as 1 | 2 | 3 | 4 | 5 | 6,
                avatar_url: this.datosFormulario.avatar_url || undefined,
            });

            // Redirigir al juego después de crear el perfil
            this.router.navigate(['/game']);
        } catch (err: any) {
            console.error('Error al crear perfil:', err);

            if (err.code === '23505') {
                this.error.set('Este apodo ya está en uso. Por favor elige otro.');
            } else {
                this.error.set('Error al crear el perfil. Por favor intenta de nuevo.');
            }
        } finally {
            this.procesando.set(false);
        }
    }

    cerrarSesion() {
        this.authService.signOut();
    }
}
