import { inject, Injectable, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CreateProfileDto, Profile } from '../models/profile.model';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private authService = inject(AuthService);
    private router = inject(Router);

    profile = signal<Profile | null>(null);
    loading = signal(false);
    private profileLoaded = false; // Flag para evitar cargas duplicadas

    constructor() {
        // Limpiar el perfil cuando el usuario cierra sesión
        effect(() => {
            const user = this.authService.user();
            if (!user) {
                this.clearProfile();
            }
        });
    }

    async loadProfile(forceRefresh = false): Promise<Profile | null> {
        const user = this.authService.user();
        if (!user) {
            this.profile.set(null);
            this.profileLoaded = false;
            return null;
        }

        // Si ya está cargado y no se fuerza la recarga, retornar el perfil en caché
        if (this.profileLoaded && !forceRefresh && this.profile()) {
            return this.profile();
        }

        // Si ya está cargando, evitar llamadas duplicadas
        if (this.loading()) {
            return this.profile();
        }

        this.loading.set(true);
        try {
            const supabase = this.authService.getSupabaseClient();
            const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No profile found
                    this.profile.set(null);
                    this.profileLoaded = true;
                    return null;
                }
                throw error;
            }

            this.profile.set(data);
            this.profileLoaded = true;
            return data;
        } catch (error) {
            console.error('Error loading profile:', error);
            this.profileLoaded = false;
            return null;
        } finally {
            this.loading.set(false);
        }
    }

    async createProfile(dto: CreateProfileDto): Promise<Profile | null> {
        const user = this.authService.user();
        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        this.loading.set(true);
        try {
            const supabase = this.authService.getSupabaseClient();
            const { data, error } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    apodo: dto.apodo,
                    grado: dto.grado,
                    avatar_url: dto.avatar_url,
                })
                .select()
                .single();

            if (error) {
                throw error;
            }

            this.profile.set(data);
            return data;
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        } finally {
            this.loading.set(false);
        }
    }

    async updateProfile(updates: Partial<CreateProfileDto>): Promise<Profile | null> {
        const user = this.authService.user();
        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        this.loading.set(true);
        try {
            const supabase = this.authService.getSupabaseClient();
            const { data, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();

            if (error) {
                throw error;
            }

            this.profile.set(data);
            return data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        } finally {
            this.loading.set(false);
        }
    }

    hasProfile(): boolean {
        return this.profile() !== null;
    }

    // Limpiar el caché del perfil (útil al cerrar sesión)
    clearProfile(): void {
        this.profile.set(null);
        this.profileLoaded = false;
    }
}
