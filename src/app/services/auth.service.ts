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
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                // Desactivar el comportamiento de auto-refresh en cambios de visibilidad
                flowType: 'pkce',
            },
            global: {
                headers: {
                    'x-application-name': 'StudyFive',
                },
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

        // Escuchar cambios de autenticación
        // Filtrar eventos innecesarios para evitar recargas constantes
        this.supabase.auth.onAuthStateChange((event, session) => {
            // Solo procesar eventos relevantes
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
                this.user.set(session?.user ?? null);

                // Manejar redirecciones basadas en el estado de autenticación
                if (event === 'SIGNED_IN' && session?.user) {
                    this.router.navigate(['/home']);
                } else if (event === 'SIGNED_OUT') {
                    this.router.navigate(['/login']);
                }
            }
            // Ignorar eventos como TOKEN_REFRESHED, INITIAL_SESSION, etc.
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
