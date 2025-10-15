import { Component, ChangeDetectionStrategy, inject, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Rango } from '../../models/profile.model';
import { CardComponent } from '../../components/card/card';

@Component({
    selector: 'app-game',
    imports: [CardComponent],
    templateUrl: './game.html',
    styleUrl: './game.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
    private authService = inject(AuthService);
    profileService = inject(ProfileService);

    profile = this.profileService.profile;

    cursoSeleccionado = signal<string | null>(null);
    etapaSeleccionada = signal<string | null>(null);

    cursos = [
        { nombre: 'Inglés', emoji: '🇺🇸', color: 'var(--pastel-blue)', img: '/img/cursos/ingles.jpg' },
        { nombre: 'Comunicación', emoji: '📝', color: 'var(--pastel-yellow)', img: '/img/cursos/comunicacion.jpg' },
        { nombre: 'Matemáticas', emoji: '➕', color: 'var(--pastel-green)', img: '/img/cursos/matematica.jpg' },
        { nombre: 'Ciencia y Tecnología', emoji: '🔬', color: 'var(--pastel-purple)', img: '/img/cursos/tecnologia.jpg' },
        { nombre: 'Personal Social', emoji: '👥', color: 'var(--pastel-pink)', img: '/img/cursos/sociales.jpg' },
        { nombre: 'Arte y Cultura', emoji: '🎨', color: 'var(--pastel-orange)', img: '/img/cursos/cultura.jpg' },
    ];

    etapas = ['Fácil', 'Intermedio', 'Difícil'];

    avatarInfo = computed(() => {
        const profile = this.profile();
        if (!profile) return null;

        const progreso = this.getProgresoRangoActual(profile.experiencia_acumulada);
        return {
            profile,
            porcentajeExp: progreso.porcentaje,
            expGanada: progreso.expGanada,
        };
    });

    ngOnInit() {
        // Asegurar que el perfil esté cargado
        if (!this.profile()) {
            this.profileService.loadProfile();
        }
    }

    getRangoLabel(rango: Rango): string {
        const labels: Record<Rango, string> = {
            madera: 'Madera 🪵',
            hierro: 'Hierro ⚙️',
            bronce: 'Bronce 🥉',
            plata: 'Plata 🥈',
            oro: 'Oro 🥇',
            platino: 'Platino 💎',
            diamante: 'Diamante 💠',
            maestro: 'Maestro 👑',
            gran_maestro: 'Gran Maestro 🏆',
            campeon: 'Campeón ⭐',
        };
        return labels[rango] || rango;
    }

    getExpParaSiguienteRango(expActual: number): number {
        const umbrales = [
            { rango: 'madera', min: 0, max: 999 },
            { rango: 'hierro', min: 1000, max: 2499 },
            { rango: 'bronce', min: 2500, max: 4999 },
            { rango: 'plata', min: 5000, max: 9999 },
            { rango: 'oro', min: 10000, max: 19999 },
            { rango: 'platino', min: 20000, max: 34999 },
            { rango: 'diamante', min: 35000, max: 54999 },
            { rango: 'maestro', min: 55000, max: 79999 },
            { rango: 'gran_maestro', min: 80000, max: 119999 },
            { rango: 'campeon', min: 120000, max: Infinity },
        ];

        for (const umbral of umbrales) {
            if (expActual >= umbral.min && expActual <= umbral.max) {
                if (umbral.max === Infinity) {
                    return 0; // Ya es el máximo rango
                }
                return umbral.max + 1 - expActual;
            }
        }
        return 0;
    }

    getProgresoRangoActual(expActual: number): { porcentaje: number; expGanada: number } {
        const umbrales = [
            { rango: 'madera', min: 0, max: 999 },
            { rango: 'hierro', min: 1000, max: 2499 },
            { rango: 'bronce', min: 2500, max: 4999 },
            { rango: 'plata', min: 5000, max: 9999 },
            { rango: 'oro', min: 10000, max: 19999 },
            { rango: 'platino', min: 20000, max: 34999 },
            { rango: 'diamante', min: 35000, max: 54999 },
            { rango: 'maestro', min: 55000, max: 79999 },
            { rango: 'gran_maestro', min: 80000, max: 119999 },
            { rango: 'campeon', min: 120000, max: Infinity },
        ];

        for (const umbral of umbrales) {
            if (expActual >= umbral.min && expActual <= umbral.max) {
                if (umbral.max === Infinity) {
                    return { porcentaje: 100, expGanada: expActual - umbral.min }; // Máximo rango
                }
                const totalExpRango = umbral.max - umbral.min + 1;
                const expGanada = expActual - umbral.min;
                const porcentaje = (expGanada / totalExpRango) * 100;
                return { porcentaje: Math.round(porcentaje), expGanada };
            }
        }
        return { porcentaje: 0, expGanada: 0 };
    }

    seleccionarCurso(curso: string) {
        this.cursoSeleccionado.set(curso);
        this.etapaSeleccionada.set(null); // Reset etapa
    }

    seleccionarEtapa(etapa: string) {
        this.etapaSeleccionada.set(etapa);
    }

    volverACursos() {
        this.cursoSeleccionado.set(null);
        this.etapaSeleccionada.set(null);
    }

    volverAEtapas() {
        this.etapaSeleccionada.set(null);
    }
}
