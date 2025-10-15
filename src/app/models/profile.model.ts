export interface Profile {
    id: string;
    apodo: string;
    grado: 1 | 2 | 3 | 4 | 5 | 6;
    experiencia_acumulada: number;
    nivel: number;
    rango: Rango;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

export type Rango = 'madera' | 'hierro' | 'bronce' | 'plata' | 'oro' | 'platino' | 'diamante' | 'maestro' | 'gran_maestro' | 'campeon';

export interface CreateProfileDto {
    apodo: string;
    grado: 1 | 2 | 3 | 4 | 5 | 6;
    avatar_url?: string;
}
