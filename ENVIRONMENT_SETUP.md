# Environment Variables

## Supabase Configuration

Para configurar Supabase en este proyecto:

1. Ve a [https://supabase.com](https://supabase.com) y crea un proyecto
2. En la configuración del proyecto, obtén:
    - `Project URL` (SUPABASE_URL)
    - `anon/public key` (SUPABASE_ANON_KEY)
3. Configura la autenticación de Google:
    - Ve a Authentication > Providers en tu dashboard de Supabase
    - Habilita el proveedor de Google
    - Configura las credenciales de OAuth de Google Cloud Console
    - Añade las URLs de redirección autorizadas

4. Actualiza los archivos de environment con tus credenciales:
    - `src/environments/environment.ts`
    - `src/environments/environment.development.ts`

```typescript
export const environment = {
    production: false,
    supabase: {
        url: 'https://tu-proyecto.supabase.co',
        anonKey: 'tu-anon-key-aqui',
    },
};
```

**IMPORTANTE:** No commitees los archivos de environment con tus credenciales reales. Añádelos al `.gitignore`.
