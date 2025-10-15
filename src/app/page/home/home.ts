import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.html',
    styleUrl: './home.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    authService = inject(AuthService);
    private router = inject(Router);

    signOut() {
        this.authService.signOut();
    }

    goToGame() {
        this.router.navigate(['/game']);
    }
}
