import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class LoginComponent {
    authService = inject(AuthService);

    signInWithGoogle() {
        this.authService.signInWithGoogle();
    }
}
