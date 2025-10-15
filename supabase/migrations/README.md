# Migraciones de Supabase

Este directorio contiene las migraciones SQL para la base de datos del proyecto.

## Orden de ejecución

Las migraciones deben ejecutarse en orden numérico:

### 001_create_profiles_table.sql

- Crea la tabla `profiles` con todos los campos necesarios
- Configura Row Level Security (RLS)
- Crea políticas de seguridad para usuarios
- Añade índices para mejorar el rendimiento
- Crea función y trigger para actualizar `updated_at` automáticamente

### 002_add_rango_calculation.sql

- Crea función para calcular el rango basado en experiencia
- Crea trigger para actualizar el rango automáticamente cuando cambia la experiencia

## Cómo ejecutar las migraciones

### Opción 1: Dashboard de Supabase

1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Navega a `SQL Editor`
3. Copia y pega el contenido de cada archivo SQL en orden
4. Ejecuta cada script

### Opción 2: Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Iniciar sesión
supabase login

# Vincular tu proyecto
supabase link --project-ref tu-project-ref

# Ejecutar migraciones
supabase db push
```

## Estructura de la tabla profiles

| Campo                 | Tipo        | Descripción                                                                                               |
| --------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| id                    | UUID        | ID del usuario (FK a auth.users)                                                                          |
| apodo                 | TEXT        | Nombre de usuario único                                                                                   |
| grado                 | INTEGER     | Grado escolar (1-6)                                                                                       |
| experiencia_acumulada | INTEGER     | Puntos de experiencia totales                                                                             |
| nivel                 | INTEGER     | Nivel actual del usuario                                                                                  |
| rango                 | TEXT        | Rango competitivo (madera, hierro, bronce, plata, oro, platino, diamante, maestro, gran_maestro, campeon) |
| avatar_url            | TEXT        | URL del avatar (opcional)                                                                                 |
| created_at            | TIMESTAMPTZ | Fecha de creación                                                                                         |
| updated_at            | TIMESTAMPTZ | Fecha de última actualización                                                                             |

## Rangos por experiencia

| Rango           | Experiencia mínima |
| --------------- | ------------------ |
| 🪵 Madera       | 0                  |
| ⚙️ Hierro       | 1,000              |
| 🥉 Bronce       | 2,500              |
| 🥈 Plata        | 5,000              |
| 🥇 Oro          | 10,000             |
| 💎 Platino      | 20,000             |
| 💠 Diamante     | 35,000             |
| 👑 Maestro      | 55,000             |
| 🏆 Gran Maestro | 80,000             |
| ⭐ Campeón      | 120,000            |
