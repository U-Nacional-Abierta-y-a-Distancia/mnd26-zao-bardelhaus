-- =====================================================================
-- Datos de prueba para datos_morichal
-- 20 lecturas por sensor (INTERNO y EXTERNO), una por hora, el 07/10/2026 de 00:00 a 19:00.
-- Cada lectura guarda temperatura y humedad: 20 h x 2 sensores x 2 mediciones = 80 filas.
--
-- EXTERNO: dia tipico de octubre en Acacias, Meta (~525 msnm, temporada de lluvias).
--   Minima ~20.5 C al amanecer (05:00-06:00), maxima ~28.8 C a las 14:00.
--   Humedad ~95 % en la madrugada y ~63 % a primera hora de la tarde.
--   Aguacero a las 16:00: la temperatura cae ~2 C y la humedad sube a ~85 %.
-- INTERNO: dentro del morichal el dosel de las palmas y el agua amortiguan el clima.
--   La temperatura varia ~45 % de lo que varia afuera y con ~1 h de retraso:
--   de noche queda ~1 C mas caliente que afuera y al mediodia ~3 C mas fresca.
--   La humedad se mantiene alta todo el dia (~83-96 %).
-- =====================================================================
INSERT INTO datos_morichal (tipo_medicion, tipo_sensor, valor, fecha_creacion) VALUES
    ('TEMPERATURA', 'INTERNO', 22.74, '2026-10-07 00:00:00'),
    ('HUMEDAD', 'INTERNO', 94.16, '2026-10-07 00:00:00'),
    ('TEMPERATURA', 'EXTERNO', 21.98, '2026-10-07 00:00:00'),
    ('HUMEDAD', 'EXTERNO', 91.12, '2026-10-07 00:00:00'),

    ('TEMPERATURA', 'INTERNO', 22.41, '2026-10-07 01:00:00'),
    ('HUMEDAD', 'INTERNO', 94.41, '2026-10-07 01:00:00'),
    ('TEMPERATURA', 'EXTERNO', 21.60, '2026-10-07 01:00:00'),
    ('HUMEDAD', 'EXTERNO', 92.17, '2026-10-07 01:00:00'),

    ('TEMPERATURA', 'INTERNO', 22.21, '2026-10-07 02:00:00'),
    ('HUMEDAD', 'INTERNO', 94.56, '2026-10-07 02:00:00'),
    ('TEMPERATURA', 'EXTERNO', 21.25, '2026-10-07 02:00:00'),
    ('HUMEDAD', 'EXTERNO', 93.59, '2026-10-07 02:00:00'),

    ('TEMPERATURA', 'INTERNO', 22.15, '2026-10-07 03:00:00'),
    ('HUMEDAD', 'INTERNO', 94.65, '2026-10-07 03:00:00'),
    ('TEMPERATURA', 'EXTERNO', 20.74, '2026-10-07 03:00:00'),
    ('HUMEDAD', 'EXTERNO', 94.62, '2026-10-07 03:00:00'),

    ('TEMPERATURA', 'INTERNO', 22.01, '2026-10-07 04:00:00'),
    ('HUMEDAD', 'INTERNO', 95.74, '2026-10-07 04:00:00'),
    ('TEMPERATURA', 'EXTERNO', 20.89, '2026-10-07 04:00:00'),
    ('HUMEDAD', 'EXTERNO', 95.43, '2026-10-07 04:00:00'),

    ('TEMPERATURA', 'INTERNO', 21.90, '2026-10-07 05:00:00'),
    ('HUMEDAD', 'INTERNO', 95.27, '2026-10-07 05:00:00'),
    ('TEMPERATURA', 'EXTERNO', 20.36, '2026-10-07 05:00:00'),
    ('HUMEDAD', 'EXTERNO', 94.03, '2026-10-07 05:00:00'),

    ('TEMPERATURA', 'INTERNO', 21.71, '2026-10-07 06:00:00'),
    ('HUMEDAD', 'INTERNO', 95.96, '2026-10-07 06:00:00'),
    ('TEMPERATURA', 'EXTERNO', 20.48, '2026-10-07 06:00:00'),
    ('HUMEDAD', 'EXTERNO', 94.48, '2026-10-07 06:00:00'),

    ('TEMPERATURA', 'INTERNO', 21.85, '2026-10-07 07:00:00'),
    ('HUMEDAD', 'INTERNO', 96.17, '2026-10-07 07:00:00'),
    ('TEMPERATURA', 'EXTERNO', 21.58, '2026-10-07 07:00:00'),
    ('HUMEDAD', 'EXTERNO', 91.68, '2026-10-07 07:00:00'),

    ('TEMPERATURA', 'INTERNO', 22.29, '2026-10-07 08:00:00'),
    ('HUMEDAD', 'INTERNO', 94.13, '2026-10-07 08:00:00'),
    ('TEMPERATURA', 'EXTERNO', 23.20, '2026-10-07 08:00:00'),
    ('HUMEDAD', 'EXTERNO', 85.32, '2026-10-07 08:00:00'),

    ('TEMPERATURA', 'INTERNO', 23.08, '2026-10-07 09:00:00'),
    ('HUMEDAD', 'INTERNO', 92.25, '2026-10-07 09:00:00'),
    ('TEMPERATURA', 'EXTERNO', 25.10, '2026-10-07 09:00:00'),
    ('HUMEDAD', 'EXTERNO', 79.99, '2026-10-07 09:00:00'),

    ('TEMPERATURA', 'INTERNO', 23.74, '2026-10-07 10:00:00'),
    ('HUMEDAD', 'INTERNO', 89.08, '2026-10-07 10:00:00'),
    ('TEMPERATURA', 'EXTERNO', 26.23, '2026-10-07 10:00:00'),
    ('HUMEDAD', 'EXTERNO', 72.46, '2026-10-07 10:00:00'),

    ('TEMPERATURA', 'INTERNO', 24.48, '2026-10-07 11:00:00'),
    ('HUMEDAD', 'INTERNO', 87.06, '2026-10-07 11:00:00'),
    ('TEMPERATURA', 'EXTERNO', 27.51, '2026-10-07 11:00:00'),
    ('HUMEDAD', 'EXTERNO', 68.80, '2026-10-07 11:00:00'),

    ('TEMPERATURA', 'INTERNO', 24.81, '2026-10-07 12:00:00'),
    ('HUMEDAD', 'INTERNO', 85.25, '2026-10-07 12:00:00'),
    ('TEMPERATURA', 'EXTERNO', 28.38, '2026-10-07 12:00:00'),
    ('HUMEDAD', 'EXTERNO', 66.69, '2026-10-07 12:00:00'),

    ('TEMPERATURA', 'INTERNO', 25.36, '2026-10-07 13:00:00'),
    ('HUMEDAD', 'INTERNO', 84.28, '2026-10-07 13:00:00'),
    ('TEMPERATURA', 'EXTERNO', 28.86, '2026-10-07 13:00:00'),
    ('HUMEDAD', 'EXTERNO', 63.94, '2026-10-07 13:00:00'),

    ('TEMPERATURA', 'INTERNO', 25.55, '2026-10-07 14:00:00'),
    ('HUMEDAD', 'INTERNO', 83.32, '2026-10-07 14:00:00'),
    ('TEMPERATURA', 'EXTERNO', 28.63, '2026-10-07 14:00:00'),
    ('HUMEDAD', 'EXTERNO', 63.26, '2026-10-07 14:00:00'),

    ('TEMPERATURA', 'INTERNO', 25.63, '2026-10-07 15:00:00'),
    ('HUMEDAD', 'INTERNO', 83.51, '2026-10-07 15:00:00'),
    ('TEMPERATURA', 'EXTERNO', 27.93, '2026-10-07 15:00:00'),
    ('HUMEDAD', 'EXTERNO', 65.67, '2026-10-07 15:00:00'),

    ('TEMPERATURA', 'INTERNO', 25.14, '2026-10-07 16:00:00'),
    ('HUMEDAD', 'INTERNO', 83.87, '2026-10-07 16:00:00'),
    ('TEMPERATURA', 'EXTERNO', 25.75, '2026-10-07 16:00:00'),
    ('HUMEDAD', 'EXTERNO', 83.49, '2026-10-07 16:00:00'),

    ('TEMPERATURA', 'INTERNO', 24.24, '2026-10-07 17:00:00'),
    ('HUMEDAD', 'INTERNO', 91.54, '2026-10-07 17:00:00'),
    ('TEMPERATURA', 'EXTERNO', 24.72, '2026-10-07 17:00:00'),
    ('HUMEDAD', 'EXTERNO', 87.36, '2026-10-07 17:00:00'),

    ('TEMPERATURA', 'INTERNO', 23.57, '2026-10-07 18:00:00'),
    ('HUMEDAD', 'INTERNO', 93.37, '2026-10-07 18:00:00'),
    ('TEMPERATURA', 'EXTERNO', 24.08, '2026-10-07 18:00:00'),
    ('HUMEDAD', 'EXTERNO', 87.46, '2026-10-07 18:00:00'),

    ('TEMPERATURA', 'INTERNO', 23.41, '2026-10-07 19:00:00'),
    ('HUMEDAD', 'INTERNO', 92.52, '2026-10-07 19:00:00'),
    ('TEMPERATURA', 'EXTERNO', 23.45, '2026-10-07 19:00:00'),
    ('HUMEDAD', 'EXTERNO', 87.84, '2026-10-07 19:00:00');
