-- =====================================================================
-- Morichal - Esquema de base de datos (PostgreSQL)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Catálogo de compromisos (equivale al enum de compromisos)
--   1 - No quemar basura
--   2 - No botar nada al morichal ni a su orilla
--   3 - Separar la basura de casa
--   4 - Hacer compost con los residuos orgánicos
--   5 - Participar en la jornada de limpieza
--   6 - Llevar reciclables al punto de acopio
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS compromisos (
    id          SMALLINT     PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO compromisos (id, descripcion) VALUES
    (1, 'No quemar basura'),
    (2, 'No botar nada al morichal ni a su orilla'),
    (3, 'Separar la basura de casa'),
    (4, 'Hacer compost con los residuos orgánicos'),
    (5, 'Participar en la jornada de limpieza'),
    (6, 'Llevar reciclables al punto de acopio')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------
-- Registros de hogar
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registros_hogar (
    id              BIGSERIAL    PRIMARY KEY,
    referencia_casa VARCHAR(150) NOT NULL,
    compromiso      SMALLINT     NOT NULL,
    CONSTRAINT fk_registros_hogar_compromiso
        FOREIGN KEY (compromiso) REFERENCES compromisos (id)
);

CREATE INDEX IF NOT EXISTS idx_registros_hogar_compromiso
    ON registros_hogar (compromiso);

-- ---------------------------------------------------------------------
-- Reportes
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reportes (
    id             BIGSERIAL    PRIMARY KEY,
    donde          VARCHAR(255) NOT NULL,
    descripcion    TEXT         NOT NULL,
    fecha_creacion TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    evidencia      VARCHAR(500)          -- URL / ruta del archivo de evidencia
);

CREATE INDEX IF NOT EXISTS idx_reportes_fecha_creacion
    ON reportes (fecha_creacion);

-- ---------------------------------------------------------------------
-- Datos del morichal (mediciones de sensores)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS datos_morichal (
    id             BIGSERIAL     PRIMARY KEY,
    tipo_medicion  VARCHAR(20)   NOT NULL,
    tipo_sensor    VARCHAR(20)   NOT NULL,
    valor          NUMERIC(10,2) NOT NULL,
    fecha_creacion TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ck_datos_morichal_tipo_medicion
        CHECK (tipo_medicion IN ('TEMPERATURA', 'HUMEDAD')),
    CONSTRAINT ck_datos_morichal_tipo_sensor
        CHECK (tipo_sensor IN ('INTERNO', 'EXTERNO'))
);

CREATE INDEX IF NOT EXISTS idx_datos_morichal_fecha_creacion
    ON datos_morichal (fecha_creacion);
