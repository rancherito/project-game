import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private supabase: SupabaseClient;
    user = signal<User | null>(null);
    loading = signal(true);

    private router = inject(Router);

    constructor() {
        this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey, {
            auth: {
                autoRefreshToken: true, // Habilita la actualización automática del token
                persistSession: true, // Mantiene la sesión persistente
                detectSessionInUrl: true, // Detecta la sesión en la URL después del login OAuth
            },
        });

        this.initSession();
    }

    private async initSession() {
        const {
            data: { session },
        } = await this.supabase.auth.getSession();
        this.user.set(session?.user ?? null);
        this.loading.set(false);

        // Redirigir automáticamente si hay sesión activa
        if (session?.user) {
            this.router.navigate(['/home']);
        }

        this.supabase.auth.onAuthStateChange((event, session) => {
            this.user.set(session?.user ?? null);

            console.log(5555);

            // Manejar redirecciones basadas en el estado de autenticación
            if (event === 'SIGNED_IN' && session?.user) {
                this.router.navigate(['/home']);
            } else if (event === 'SIGNED_OUT') {
                this.router.navigate(['/login']);
            }
        });
    }

    async signInWithGoogle() {
        const { error } = await this.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/home`,
            },
        });

        if (error) {
            console.error('Error signing in with Google:', error);
        }
    }

    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error) {
            console.error('Error signing out:', error);
        }
        // La redirección se maneja automáticamente en onAuthStateChange
    }

    getSupabaseClient(): SupabaseClient {
        return this.supabase;
    }
}
