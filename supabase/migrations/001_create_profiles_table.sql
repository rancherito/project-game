-- Crear la tabla de perfiles de usuario
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    apodo TEXT NOT NULL UNIQUE,
    grado INTEGER NOT NULL CHECK (grado >= 1 AND grado <= 6),
    experiencia_acumulada INTEGER NOT NULL DEFAULT 0,
    nivel INTEGER NOT NULL DEFAULT 1,
    rango TEXT NOT NULL DEFAULT 'madera' CHECK (
        rango IN ('madera', 'hierro', 'bronce', 'plata', 'oro', 'platino', 'diamante', 'maestro', 'gran_maestro', 'campeon')
    ),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Política: Los usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Crear índices para mejorar el rendimiento
CREATE INDEX profiles_apodo_idx ON public.profiles(apodo);
CREATE INDEX profiles_rango_idx ON public.profiles(rango);
CREATE INDEX profiles_nivel_idx ON public.profiles(nivel);

-- Función para actualizar el timestamp de updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE public.profiles IS 'Perfiles de usuario con información del juego';
COMMENT ON COLUMN public.profiles.apodo IS 'Nombre de usuario único en el juego';
COMMENT ON COLUMN public.profiles.grado IS 'Grado escolar del usuario (1-6)';
COMMENT ON COLUMN public.profiles.experiencia_acumulada IS 'Puntos de experiencia totales del usuario';
COMMENT ON COLUMN public.profiles.nivel IS 'Nivel actual del usuario en el juego';
COMMENT ON COLUMN public.profiles.rango IS 'Rango competitivo del usuario';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL del avatar del usuario';
