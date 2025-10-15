-- Función para calcular el rango basado en experiencia y nivel
CREATE OR REPLACE FUNCTION public.calculate_rango(exp INTEGER, lvl INTEGER)
RETURNS TEXT AS $$
BEGIN
    IF exp < 1000 THEN
        RETURN 'madera';
    ELSIF exp < 2500 THEN
        RETURN 'hierro';
    ELSIF exp < 5000 THEN
        RETURN 'bronce';
    ELSIF exp < 10000 THEN
        RETURN 'plata';
    ELSIF exp < 20000 THEN
        RETURN 'oro';
    ELSIF exp < 35000 THEN
        RETURN 'platino';
    ELSIF exp < 55000 THEN
        RETURN 'diamante';
    ELSIF exp < 80000 THEN
        RETURN 'maestro';
    ELSIF exp < 120000 THEN
        RETURN 'gran_maestro';
    ELSE
        RETURN 'campeon';
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Función para actualizar el rango automáticamente cuando cambia la experiencia
CREATE OR REPLACE FUNCTION public.update_rango_on_exp_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actualizar si la experiencia cambió
    IF NEW.experiencia_acumulada != OLD.experiencia_acumulada THEN
        NEW.rango = public.calculate_rango(NEW.experiencia_acumulada, NEW.nivel);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el rango automáticamente
CREATE TRIGGER update_rango_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    WHEN (NEW.experiencia_acumulada IS DISTINCT FROM OLD.experiencia_acumulada)
    EXECUTE FUNCTION public.update_rango_on_exp_change();

-- Comentarios
COMMENT ON FUNCTION public.calculate_rango IS 'Calcula el rango del usuario basado en experiencia y nivel';
COMMENT ON FUNCTION public.update_rango_on_exp_change IS 'Actualiza automáticamente el rango cuando cambia la experiencia';
