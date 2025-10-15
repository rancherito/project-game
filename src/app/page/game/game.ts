import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { Rango } from '../../models/profile.model';

@Component({
    selector: 'app-game',
    imports: [],
    templateUrl: './game.html',
    styleUrl: './game.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameComponent implements OnInit {
    private router = inject(Router);
    private authService = inject(AuthService);
    profileService = inject(ProfileService);

    profile = this.profileService.profile;

    ngOnInit() {
        // Asegurar que el perfil esté cargado
        if (!this.profile()) {
            this.profileService.loadProfile();
        }
    }

    getRangoLabel(rango: Rango): string {
        const labels: Record<Rango, string> = {
            madera: '🪵 Madera',
            hierro: '⚙️ Hierro',
            bronce: '🥉 Bronce',
            plata: '🥈 Plata',
            oro: '🥇 Oro',
            platino: '💎 Platino',
            diamante: '💠 Diamante',
            maestro: '👑 Maestro',
            gran_maestro: '🏆 Gran Maestro',
            campeon: '⭐ Campeón',
        };
        return labels[rango] || rango;
    }

    cerrarSesion() {
        this.authService.signOut();
    }
}
