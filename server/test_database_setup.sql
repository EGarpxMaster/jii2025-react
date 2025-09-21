/* =========================================================
   INSTALACIÓN LIMPIA – JORNADA DE INGENIERÍA INDUSTRIAL 2025
   MySQL 8.4
   ========================================================= */

-- (0) Crear BD limpia y ajustar modo de sesión
DROP DATABASE IF EXISTS jornada_ii_test;
CREATE DATABASE jornada_ii_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jornada_ii_test;

SET SESSION sql_mode = CONCAT_WS(',', @@SESSION.sql_mode,
  'STRICT_TRANS_TABLES','ERROR_FOR_DIVISION_BY_ZERO','NO_ENGINE_SUBSTITUTION');

-- ========================================================
-- (1) TABLAS
-- ========================================================

-- 1.1 participantes
CREATE TABLE participantes (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Información personal
  apellido_paterno VARCHAR(100) NOT NULL,
  apellido_materno VARCHAR(100) NOT NULL,
  primer_nombre    VARCHAR(100) NOT NULL,
  segundo_nombre   VARCHAR(100) NULL,

  -- Contacto
  email    VARCHAR(255) NOT NULL UNIQUE,
  telefono VARCHAR(20)  NULL,

  -- Clasificación
  categoria ENUM('Estudiante','Docente','Staff','Ponente','Asistente Externo') NOT NULL,
  programa ENUM(
    'Ingeniería Industrial',
    'Ingeniería Ambiental', 
    'Ingeniería en Datos e Inteligencia Organizacional',
    'Ingeniería en Logística y Cadena de Suministro',
    'Ingeniería en Inteligencia Artificial',
    'Ingeniería en Industrias Alimentarias'
  ) NULL,

  -- Control de asistencia (opcional en DB, obligatorio en frontend)
  brazalete INT NULL UNIQUE,

  -- Timestamps
  creado     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Restricciones
  CONSTRAINT chk_brazalete_range CHECK (brazalete IS NULL OR (brazalete BETWEEN 1 AND 500)),

  -- Índices
  INDEX idx_email (email),
  INDEX idx_categoria (categoria),
  INDEX idx_brazalete (brazalete),
  INDEX idx_programa (programa)
) ENGINE=InnoDB;

-- 1.2 actividades
CREATE TABLE actividades (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Identificación
  codigo VARCHAR(10) NULL UNIQUE,
  titulo VARCHAR(500) NOT NULL,

  -- Detalles del evento
  ponente     VARCHAR(200) NULL,
  institucion VARCHAR(300) NULL,
  bio_ponente TEXT NULL,
  descripcion TEXT NULL,

  -- Recursos multimedia
  imagen_ponente VARCHAR(500) NULL,
  banner         VARCHAR(500) NULL,

  -- Programación
  fecha_inicio DATETIME NOT NULL,
  fecha_fin    DATETIME NOT NULL,
  lugar        VARCHAR(200) NULL,

  -- Configuración
  tipo ENUM('Workshop','Conferencia','Foro') NOT NULL,
  cupo_maximo INT NOT NULL,
  activa BOOLEAN DEFAULT TRUE,

  -- Timestamps
  creado      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Restricciones (cupo>0 y topes por tipo; fechas correctas)
  CONSTRAINT chk_cupo_tipo CHECK (
    cupo_maximo > 0 AND
    ( (tipo='Workshop' AND cupo_maximo <= 30)
      OR (tipo IN ('Conferencia','Foro') AND cupo_maximo <= 150) )
  ),
  CONSTRAINT chk_fechas_act CHECK (fecha_fin > fecha_inicio),

  -- Índices
  INDEX idx_codigo (codigo),
  INDEX idx_tipo (tipo),
  INDEX idx_fecha_inicio (fecha_inicio),
  INDEX idx_activa (activa),
  INDEX idx_tipo_fecha (tipo, fecha_inicio)
) ENGINE=InnoDB;

-- 1.3 inscripciones_workshop
CREATE TABLE inscripciones_workshop (
  id INT AUTO_INCREMENT PRIMARY KEY,

  participante_id INT NOT NULL,
  actividad_id    INT NOT NULL,

  estado ENUM('inscrito','lista_espera','cancelado') NOT NULL DEFAULT 'inscrito',

  creado      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (participante_id) REFERENCES participantes(id) ON DELETE CASCADE,
  FOREIGN KEY (actividad_id)    REFERENCES actividades(id)    ON DELETE CASCADE,

  -- Un participante no puede duplicar la misma actividad
  UNIQUE KEY uk_actividad_participante (actividad_id, participante_id),

  -- Índices
  INDEX idx_participante (participante_id),
  INDEX idx_actividad (actividad_id),
  INDEX idx_estado (estado),
  INDEX idx_actividad_estado (actividad_id, estado)
) ENGINE=InnoDB;

-- 1.4 asistencias
CREATE TABLE asistencias (
  id INT AUTO_INCREMENT PRIMARY KEY,

  participante_id INT NOT NULL,
  actividad_id    INT NOT NULL,

  estado ENUM('registrado','presente','ausente') NOT NULL DEFAULT 'registrado',
  modo_asistencia ENUM('self','staff','qr')      NOT NULL DEFAULT 'self',
  fecha_asistencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notas TEXT NULL,

  FOREIGN KEY (participante_id) REFERENCES participantes(id) ON DELETE CASCADE,
  FOREIGN KEY (actividad_id)    REFERENCES actividades(id)    ON DELETE CASCADE,

  UNIQUE KEY unique_participant_activity (participante_id, actividad_id),

  INDEX idx_participante (participante_id),
  INDEX idx_actividad (actividad_id),
  INDEX idx_estado (estado),
  INDEX idx_fecha (fecha_asistencia)
) ENGINE=InnoDB;

-- 1.5 estados_mexico
CREATE TABLE estados_mexico (
  id INT AUTO_INCREMENT PRIMARY KEY,

  nombre VARCHAR(100) NOT NULL UNIQUE,
  codigo VARCHAR(10)  NOT NULL UNIQUE,
  region ENUM('Norte','Centro','Sur','Sureste') NOT NULL,

  disponible BOOLEAN DEFAULT TRUE,

  creado      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_disponible (disponible),
  INDEX idx_region (region)
) ENGINE=InnoDB;

-- 1.6 equipos_concurso (CON AUTO-NAMING)
CREATE TABLE equipos_concurso (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- El nombre_equipo se auto-genera como "Equipo {estado}" mediante triggers
  nombre_equipo VARCHAR(100) NOT NULL UNIQUE,
  estado_id INT NOT NULL,

  email_capitan  VARCHAR(255) NOT NULL,
  email_miembro_1 VARCHAR(255) NOT NULL,
  email_miembro_2 VARCHAR(255) NOT NULL,
  email_miembro_3 VARCHAR(255) NOT NULL,
  email_miembro_4 VARCHAR(255) NOT NULL,
  email_miembro_5 VARCHAR(255) NOT NULL,

  estado_registro ENUM('pendiente','confirmado','cancelado') DEFAULT 'pendiente',
  activo BOOLEAN DEFAULT TRUE,
  activo_concurso BOOLEAN DEFAULT TRUE,

  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_confirmacion TIMESTAMP NULL,
  actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (estado_id) REFERENCES estados_mexico(id),

  -- Cada email solo puede estar en un equipo
  UNIQUE KEY unique_capitan  (email_capitan),
  UNIQUE KEY unique_miembro_1 (email_miembro_1),
  UNIQUE KEY unique_miembro_2 (email_miembro_2),
  UNIQUE KEY unique_miembro_3 (email_miembro_3),
  UNIQUE KEY unique_miembro_4 (email_miembro_4),
  UNIQUE KEY unique_miembro_5 (email_miembro_5),

  -- Solo un equipo por estado
  UNIQUE KEY unique_estado (estado_id)
) ENGINE=InnoDB;

-- 1.7 configuracion_sistema
CREATE TABLE configuracion_sistema (
  id INT AUTO_INCREMENT PRIMARY KEY,

  clave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  descripcion TEXT NULL,
  tipo ENUM('fecha','numero','texto','booleano') DEFAULT 'texto',

  creado      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  actualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_clave (clave),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB;

-- Índices compuestos adicionales para performance
CREATE INDEX idx_actividades_tipo_fecha_activa ON actividades(tipo, fecha_inicio, activa);
CREATE INDEX idx_inscripciones_participante_estado ON inscripciones_workshop(participante_id, estado);
CREATE INDEX idx_asistencias_actividad_fecha ON asistencias(actividad_id, fecha_asistencia);
CREATE INDEX idx_equipos_estado_fecha ON equipos_concurso(estado_registro, fecha_registro);
CREATE INDEX idx_participantes_categoria_programa ON participantes(categoria, programa);

-- ========================================================
-- (2) FUNCIONES
-- ========================================================
DELIMITER //

CREATE FUNCTION fn_en_ventana_registro()
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE ahora DATETIME;
  DECLARE inicio DATETIME;
  DECLARE fin DATETIME;

  SET ahora = NOW();
  SELECT STR_TO_DATE(valor, '%Y-%m-%d %H:%i:%s') INTO inicio FROM configuracion_sistema WHERE clave='registro_inicio';
  SELECT STR_TO_DATE(valor, '%Y-%m-%d %H:%i:%s') INTO fin    FROM configuracion_sistema WHERE clave='registro_fin';
  RETURN (ahora >= inicio AND ahora <= fin);
END//

CREATE FUNCTION fn_en_ventana_workshop()
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE ahora DATETIME;
  DECLARE inicio DATETIME;
  DECLARE fin DATETIME;

  SET ahora = NOW();
  SELECT STR_TO_DATE(valor, '%Y-%m-%d %H:%i:%s') INTO inicio FROM configuracion_sistema WHERE clave='workshop_inscripcion_inicio';
  SELECT STR_TO_DATE(valor, '%Y-%m-%d %H:%i:%s') INTO fin    FROM configuracion_sistema WHERE clave='workshop_inscripcion_fin';
  RETURN (ahora >= inicio AND ahora <= fin);
END//

CREATE FUNCTION fn_en_ventana_marcaje(fecha_inicio DATETIME)
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE ahora DATETIME;
  DECLARE inicio_ventana DATETIME;
  DECLARE fin_ventana DATETIME;
  DECLARE minutos_antes INT;
  DECLARE minutos_despues INT;

  SET ahora = NOW();

  SELECT CAST(valor AS SIGNED) INTO minutos_antes  FROM configuracion_sistema WHERE clave='ventana_marcaje_antes';
  SELECT CAST(valor AS SIGNED) INTO minutos_despues FROM configuracion_sistema WHERE clave='ventana_marcaje_despues';

  SET inicio_ventana = DATE_SUB(fecha_inicio, INTERVAL minutos_antes MINUTE);
  SET fin_ventana    = DATE_ADD(fecha_inicio, INTERVAL minutos_despues MINUTE);

  RETURN (ahora >= inicio_ventana AND ahora <= fin_ventana);
END//

CREATE FUNCTION fn_en_ventana_concurso()
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
  DECLARE ahora DATETIME;
  DECLARE inicio DATETIME;
  DECLARE fin DATETIME;

  SET ahora = NOW();
  SELECT STR_TO_DATE(valor, '%Y-%m-%d %H:%i:%s') INTO inicio FROM configuracion_sistema WHERE clave='concurso_inscripcion_inicio';
  SELECT STR_TO_DATE(valor, '%Y-%m-%d %H:%i:%s') INTO fin    FROM configuracion_sistema WHERE clave='concurso_inscripcion_fin';
  RETURN (ahora >= inicio AND ahora <= fin);
END//

DELIMITER ;

-- ========================================================
-- (3) PROCEDIMIENTOS
-- ========================================================
DELIMITER //

CREATE PROCEDURE sp_estadisticas_sistema()
BEGIN
  -- PARTICIPANTES
  SELECT 
    'PARTICIPANTES' AS categoria,
    COUNT(*) AS total,
    (SELECT COUNT(*) FROM participantes WHERE categoria='Estudiante') AS estudiantes,
    (SELECT COUNT(*) FROM participantes WHERE categoria='Docente') AS docentes,
    (SELECT COUNT(*) FROM participantes WHERE categoria='Staff') AS staff,
    (SELECT COUNT(*) FROM participantes WHERE categoria='Ponente') AS ponentes,
    (SELECT COUNT(*) FROM participantes WHERE categoria='Asistente Externo') AS externos
  FROM participantes

  UNION ALL

  -- WORKSHOPS
  SELECT
    'WORKSHOPS' AS categoria,
    (SELECT COUNT(*) FROM actividades WHERE tipo='Workshop' AND activa=TRUE) AS total,
    SUM(cupo_maximo) AS cupo_total,
    (SELECT COUNT(*) FROM inscripciones_workshop WHERE estado='inscrito') AS inscritos,
    (SELECT COUNT(*) FROM inscripciones_workshop WHERE estado='lista_espera') AS lista_espera,
    0 AS col5, 0 AS col6
  FROM actividades
  WHERE tipo='Workshop' AND activa=TRUE

  UNION ALL

  -- EQUIPOS CONCURSO
  SELECT
    'EQUIPOS_CONCURSO' AS categoria,
    COUNT(*) AS total,
    (SELECT COUNT(*) FROM equipos_concurso WHERE estado_registro='confirmado') AS confirmados,
    (SELECT COUNT(*) FROM estados_mexico WHERE disponible=FALSE) AS estados_ocupados,
    (SELECT COUNT(*) FROM estados_mexico WHERE disponible=TRUE) AS estados_disponibles,
    0 AS col5, 0 AS col6
  FROM equipos_concurso;
END//

CREATE PROCEDURE sp_liberar_cupo_workshop(IN p_actividad_id INT)
BEGIN
  DECLARE v_participante_id INT;

  -- Promover al primero en espera (FIFO)
  SELECT participante_id
    INTO v_participante_id
  FROM inscripciones_workshop
  WHERE actividad_id=p_actividad_id
    AND estado='lista_espera'
  ORDER BY creado ASC
  LIMIT 1;

  IF v_participante_id IS NOT NULL THEN
    UPDATE inscripciones_workshop
    SET estado='inscrito', actualizado=NOW()
    WHERE participante_id=v_participante_id
      AND actividad_id=p_actividad_id
      AND estado='lista_espera'
    LIMIT 1;
  END IF;
END//

DELIMITER ;

-- ========================================================
-- (4) VISTAS
-- ========================================================

-- 4.1 Vista workshops con semáforo (usando % disponible y umbrales de configuración)
CREATE VIEW v_workshop_stats AS
SELECT 
  a.id,
  a.codigo,
  a.titulo,
  a.ponente,
  a.institucion,
  a.bio_ponente,
  a.descripcion,
  a.imagen_ponente,
  a.banner,
  a.fecha_inicio,
  a.fecha_fin,
  a.lugar,
  a.tipo,
  a.cupo_maximo,
  COALESCE(iw_count.inscritos, 0) AS inscritos,
  GREATEST(a.cupo_maximo - COALESCE(iw_count.inscritos, 0), 0) AS cupo_disponible,
  ROUND( (COALESCE(iw_count.inscritos,0) / NULLIF(a.cupo_maximo,0)) * 100, 2) AS porcentaje_ocupado,
  ROUND( (GREATEST(a.cupo_maximo - COALESCE(iw_count.inscritos,0),0) / NULLIF(a.cupo_maximo,0)) * 100, 2) AS porcentaje_disponible,
  (SELECT CAST(valor AS UNSIGNED) FROM configuracion_sistema WHERE clave='cupo_verde_min')    AS umbral_verde,
  (SELECT CAST(valor AS UNSIGNED) FROM configuracion_sistema WHERE clave='cupo_amarillo_min') AS umbral_amarillo,
  CASE 
    WHEN a.cupo_maximo IS NULL OR a.cupo_maximo=0 THEN 'red'
    WHEN ((GREATEST(a.cupo_maximo - COALESCE(iw_count.inscritos,0),0) / a.cupo_maximo) * 100) >= (SELECT CAST(valor AS UNSIGNED) FROM configuracion_sistema WHERE clave='cupo_verde_min') THEN 'green'
    WHEN ((GREATEST(a.cupo_maximo - COALESCE(iw_count.inscritos,0),0) / a.cupo_maximo) * 100) >= (SELECT CAST(valor AS UNSIGNED) FROM configuracion_sistema WHERE clave='cupo_amarillo_min') THEN 'yellow'
    ELSE 'red'
  END AS color_cupo,
  CASE 
    WHEN COALESCE(iw_count.inscritos,0) >= a.cupo_maximo THEN 'LLENO'
    WHEN (COALESCE(iw_count.inscritos,0) / NULLIF(a.cupo_maximo,0)) >= 0.9 THEN 'CASI_LLENO'
    ELSE 'DISPONIBLE'
  END AS estado_cupo,
  a.activa
FROM actividades a
LEFT JOIN (
  SELECT actividad_id, COUNT(*) AS inscritos
  FROM inscripciones_workshop
  WHERE estado='inscrito'
  GROUP BY actividad_id
) iw_count ON a.id = iw_count.actividad_id
WHERE a.tipo='Workshop' AND a.activa=TRUE;

-- 4.2 Vista participantes completos
CREATE VIEW v_participantes_completos AS
SELECT 
  p.*,
  CONCAT(
    p.primer_nombre,
    CASE WHEN p.segundo_nombre IS NOT NULL THEN CONCAT(' ', p.segundo_nombre) ELSE '' END,
    ' ', p.apellido_paterno, ' ', p.apellido_materno
  ) AS nombre_completo
FROM participantes p;

-- 4.3 Vista asistencias estadísticas para conferencias/foros
CREATE VIEW v_asistencias_stats AS
SELECT 
  a.id,
  a.codigo,
  a.titulo,
  a.tipo,
  a.cupo_maximo,
  COALESCE(asist_count.asistentes, 0) AS asistentes,
  GREATEST(a.cupo_maximo - COALESCE(asist_count.asistentes, 0), 0) AS cupo_disponible,
  ROUND( (COALESCE(asist_count.asistentes,0) / NULLIF(a.cupo_maximo,0)) * 100, 2) AS porcentaje_asistencia,
  a.fecha_inicio,
  a.fecha_fin,
  a.lugar,
  a.ponente,
  a.activa
FROM actividades a
LEFT JOIN (
  SELECT actividad_id, COUNT(*) AS asistentes
  FROM asistencias
  WHERE estado IN ('registrado','presente')
  GROUP BY actividad_id
) asist_count ON a.id = asist_count.actividad_id
WHERE a.tipo IN ('Conferencia','Foro') AND a.activa=TRUE;

-- 4.4 Vista asistencias para workshops
CREATE VIEW v_asistencias_workshops AS
SELECT 
  a.id,
  a.codigo,
  a.titulo,
  a.tipo,
  a.cupo_maximo,
  COALESCE(asist_count.asistentes, 0) AS asistentes,
  GREATEST(a.cupo_maximo - COALESCE(asist_count.asistentes, 0), 0) AS cupo_disponible,
  ROUND( (COALESCE(asist_count.asistentes,0) / NULLIF(a.cupo_maximo,0)) * 100, 2) AS porcentaje_asistencia,
  a.fecha_inicio,
  a.fecha_fin,
  a.lugar,
  a.ponente,
  a.activa
FROM actividades a
LEFT JOIN (
  SELECT actividad_id, COUNT(*) AS asistentes
  FROM asistencias
  WHERE estado IN ('registrado','presente')
  GROUP BY actividad_id
) asist_count ON a.id = asist_count.actividad_id
WHERE a.tipo='Workshop' AND a.activa=TRUE;

-- ========================================================
-- (5) TRIGGERS
-- ========================================================
DELIMITER //

-- 5.1 Concurso: bloquear estado cuando confirma; reabrir si cancela
CREATE TRIGGER tr_equipo_confirmado
AFTER UPDATE ON equipos_concurso
FOR EACH ROW
BEGIN
  IF NEW.estado_registro='confirmado' AND OLD.estado_registro<>'confirmado' THEN
    UPDATE estados_mexico SET disponible=FALSE WHERE id=NEW.estado_id;
  ELSEIF NEW.estado_registro='cancelado' AND OLD.estado_registro='confirmado' THEN
    UPDATE estados_mexico SET disponible=TRUE  WHERE id=NEW.estado_id;
  END IF;
END//

-- 5.2 Workshops: un solo activo (inscrito/lista_espera) por participante
CREATE TRIGGER tr_workshop_unico_insert
BEFORE INSERT ON inscripciones_workshop
FOR EACH ROW
BEGIN
  DECLARE activos INT DEFAULT 0;
  IF NEW.estado IN ('inscrito','lista_espera') THEN
    SELECT COUNT(*) INTO activos
    FROM inscripciones_workshop
    WHERE participante_id = NEW.participante_id
      AND estado IN ('inscrito','lista_espera');
    IF activos > 0 THEN
      SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT='Ya existe un workshop activo (inscrito/lista_espera) para este participante';
    END IF;
  END IF;
END//

-- 5.3 Workshops: validar cupo y mandar a lista_espera si está lleno
CREATE TRIGGER tr_validar_cupo_workshop
BEFORE INSERT ON inscripciones_workshop
FOR EACH ROW
BEGIN
  DECLARE v_cupo INT;
  DECLARE v_inscritos INT;

  IF NEW.estado='inscrito' THEN
    SELECT a.cupo_maximo INTO v_cupo
    FROM actividades a
    WHERE a.id=NEW.actividad_id AND a.tipo='Workshop';

    SELECT COUNT(*) INTO v_inscritos
    FROM inscripciones_workshop
    WHERE actividad_id=NEW.actividad_id AND estado='inscrito';

    IF v_inscritos >= v_cupo THEN
      SET NEW.estado='lista_espera';
    END IF;
  END IF;
END//

-- 5.4 Workshops: promoción automática al cancelar un inscrito
CREATE TRIGGER tr_promover_lista_espera_cancelacion
AFTER UPDATE ON inscripciones_workshop
FOR EACH ROW
BEGIN
  DECLARE v_participante_siguiente INT;

  IF OLD.estado='inscrito' AND NEW.estado='cancelado' THEN
    SELECT participante_id
      INTO v_participante_siguiente
    FROM inscripciones_workshop
    WHERE actividad_id=OLD.actividad_id
      AND estado='lista_espera'
    ORDER BY creado ASC
    LIMIT 1;

    IF v_participante_siguiente IS NOT NULL THEN
      UPDATE inscripciones_workshop
      SET estado='inscrito', actualizado=NOW()
      WHERE participante_id=v_participante_siguiente
        AND actividad_id=OLD.actividad_id
        AND estado='lista_espera'
      LIMIT 1;
    END IF;
  END IF;
END//

-- 5.5 Concurso: Auto-generar nombre y validaciones (INSERT)
CREATE TRIGGER tr_equipos_concurso_bi
BEFORE INSERT ON equipos_concurso
FOR EACH ROW
BEGIN
  DECLARE v_max INT;
  DECLARE v_confirmados INT;
  DECLARE v_estado_nombre VARCHAR(100);

  -- AUTO-GENERAR NOMBRE DEL EQUIPO basado en el estado
  SELECT nombre INTO v_estado_nombre FROM estados_mexico WHERE id = NEW.estado_id;
  SET NEW.nombre_equipo = CONCAT('Equipo ', v_estado_nombre);

  -- Ventana de inscripción (COMENTADO PARA PRUEBAS)
  -- IF NOT fn_en_ventana_concurso() THEN
  --   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Fuera de la ventana de inscripción al concurso';
  -- END IF;

  -- Correos deben existir en participantes
  IF (SELECT COUNT(*) FROM participantes WHERE email IN
      (NEW.email_capitan, NEW.email_miembro_1, NEW.email_miembro_2, NEW.email_miembro_3, NEW.email_miembro_4, NEW.email_miembro_5)) <> 6 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Todos los correos del equipo deben existir en participantes';
  END IF;

  -- Tope si entra como confirmado
  IF NEW.estado_registro='confirmado' THEN
    SELECT CAST(valor AS UNSIGNED) INTO v_max FROM configuracion_sistema WHERE clave='max_equipos_concurso';
    SELECT COUNT(*) INTO v_confirmados FROM equipos_concurso WHERE estado_registro='confirmado';
    IF v_confirmados >= v_max THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Tope de equipos confirmados alcanzado';
    END IF;
  END IF;
END//

-- 5.6 Concurso: Auto-actualizar nombre y validaciones (UPDATE)
CREATE TRIGGER tr_equipos_concurso_bu
BEFORE UPDATE ON equipos_concurso
FOR EACH ROW
BEGIN
  DECLARE v_max INT;
  DECLARE v_confirmados INT;
  DECLARE v_estado_nombre VARCHAR(100);

  -- AUTO-GENERAR NOMBRE DEL EQUIPO si cambia el estado
  IF OLD.estado_id <> NEW.estado_id THEN
    SELECT nombre INTO v_estado_nombre FROM estados_mexico WHERE id = NEW.estado_id;
    SET NEW.nombre_equipo = CONCAT('Equipo ', v_estado_nombre);
  END IF;

  IF NEW.estado_registro='confirmado' AND OLD.estado_registro<>'confirmado' THEN
    -- Ventana de inscripción (COMENTADO PARA PRUEBAS)
    -- IF NOT fn_en_ventana_concurso() THEN
    --   SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Fuera de la ventana de inscripción al concurso';
    -- END IF;

    SELECT CAST(valor AS UNSIGNED) INTO v_max FROM configuracion_sistema WHERE clave='max_equipos_concurso';
    SELECT COUNT(*) INTO v_confirmados FROM equipos_concurso WHERE estado_registro='confirmado';
    IF v_confirmados >= v_max THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Tope de equipos confirmados alcanzado';
    END IF;
  END IF;

  -- Validar correos (por si se editan)
  IF (SELECT COUNT(*) FROM participantes WHERE email IN
      (NEW.email_capitan, NEW.email_miembro_1, NEW.email_miembro_2, NEW.email_miembro_3, NEW.email_miembro_4, NEW.email_miembro_5)) <> 6 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Todos los correos del equipo deben existir en participantes';
  END IF;
END//

DELIMITER ;

-- ========================================================
-- (6) DATOS INICIALES
-- ========================================================

-- 6.1 Configuración del sistema
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo) VALUES
('registro_inicio', '2025-09-22 09:00:00', 'Inicio del registro general', 'fecha'),
('registro_fin', '2025-09-26 23:59:59', 'Fin del registro general', 'fecha'),
('workshop_inscripcion_inicio', '2025-09-22 09:00:00', 'Inicio de inscripciones a workshops', 'fecha'),
('workshop_inscripcion_fin', '2025-09-23 23:59:59', 'Fin de inscripciones a workshops', 'fecha'),
('concurso_inscripcion_inicio', '2025-09-22 09:00:00', 'Inicio de inscripciones al concurso', 'fecha'),
('concurso_inscripcion_fin', '2025-09-23 23:59:59', 'Fin de inscripciones al concurso', 'fecha'),
('ventana_marcaje_antes', '15', 'Minutos antes del evento para marcar asistencia', 'numero'),
('ventana_marcaje_despues', '15', 'Minutos después del inicio para marcar asistencia', 'numero'),
('max_equipos_concurso', '16', 'Máximo de equipos del concurso', 'numero'),
('cupo_verde_min', '30', 'Porcentaje disponible mínimo para badge verde', 'numero'),
('cupo_amarillo_min', '10', 'Porcentaje disponible mínimo para badge amarillo', 'numero');

-- 6.2 Estados de México
INSERT INTO estados_mexico (nombre, codigo, region) VALUES
('Aguascalientes', 'AGS', 'Centro'),
('Baja California', 'BC', 'Norte'),
('Baja California Sur', 'BCS', 'Norte'),
('Campeche', 'CAM', 'Sureste'),
('Chiapas', 'CHP', 'Sur'),
('Chihuahua', 'CHH', 'Norte'),
('Ciudad de México', 'CDMX', 'Centro'),
('Coahuila', 'COA', 'Norte'),
('Colima', 'COL', 'Centro'),
('Durango', 'DUR', 'Norte'),
('Estado de México', 'MEX', 'Centro'),
('Guanajuato', 'GTO', 'Centro'),
('Guerrero', 'GRO', 'Sur'),
('Hidalgo', 'HGO', 'Centro'),
('Jalisco', 'JAL', 'Centro'),
('Michoacán', 'MIC', 'Centro'),
('Morelos', 'MOR', 'Centro'),
('Nayarit', 'NAY', 'Centro'),
('Nuevo León', 'NL', 'Norte'),
('Oaxaca', 'OAX', 'Sur'),
('Puebla', 'PUE', 'Centro'),
('Querétaro', 'QRO', 'Centro'),
('Quintana Roo', 'QR', 'Sureste'),
('San Luis Potosí', 'SLP', 'Centro'),
('Sinaloa', 'SIN', 'Norte'),
('Sonora', 'SON', 'Norte'),
('Tabasco', 'TAB', 'Sureste'),
('Tamaulipas', 'TAM', 'Norte'),
('Tlaxcala', 'TLA', 'Centro'),
('Veracruz', 'VER', 'Centro'),
('Yucatán', 'YUC', 'Sureste'),
('Zacatecas', 'ZAC', 'Centro');

-- 6.3 Carga inicial de ponentes (participantes)
INSERT INTO participantes (apellido_paterno, apellido_materno, primer_nombre, segundo_nombre, email, telefono, categoria, programa, brazalete) VALUES
('Mata', 'Pérez', 'Miguel', NULL, 'miguel.matapr@uanl.edu.mx', NULL, 'Ponente', NULL, NULL),
('Flores', 'Hernández', 'Cynthia', 'Graciela', 'cynthiagraciela84@gmail.com', NULL, 'Ponente', NULL, NULL),
('Zavala', 'Serrano', 'Aaron', NULL, 'aaron.zavala.serrano@gmail.com', NULL, 'Ponente', NULL, NULL),
('Guzmán', 'Contreras', 'Arturo', NULL, 'arturoguzman652@gmail.com', NULL, 'Ponente', NULL, NULL),
('Pérez', 'Castillo', 'Fernando', NULL, 'profercarp@gmail.com', NULL, 'Ponente', NULL, NULL),
('Hurtado', 'Moreno', 'Juan', 'José', 'hurtadoupiicsa@yahoo.com', NULL, 'Ponente', NULL, NULL),
('Pérez', 'Ramos', 'Martha', 'Elva', 'martha.pr@queretaro.tecnm.mx', NULL, 'Ponente', NULL, NULL),
('Cárdenas', 'León', 'Alejandro', 'Charbel', 'accardenas@ucaribe.edu.mx', NULL, 'Ponente', NULL, NULL),
('Ramírez', 'Carmona', 'Leslye', 'Johanna', 'lramirez@ucaribe.edu.mx', NULL, 'Ponente', NULL, NULL);

-- 6.4 Actividades – Conferencias y Foros (25–26/09/2025)
INSERT INTO actividades (codigo, titulo, ponente, institucion, fecha_inicio, fecha_fin, lugar, descripcion, tipo, cupo_maximo, activa, bio_ponente, imagen_ponente, banner) VALUES
('C1', 'Optimización en una línea de producción: un caso real', 
 'Dr. Miguel Mata Pérez', 'Universidad Autónoma de Nuevo León',
 '2025-09-25 16:00:00', '2025-09-25 17:00:00',
 'Auditorio de Ingenierías Edificio G',
 'En manufactura el tiempo de entrega de los productos es de vital importancia... En esta plática se presenta el caso de una empresa líder que enfrenta problemas de programación y secuenciamiento en el piso de producción.',
 'Conferencia', 150, TRUE,
 'Doctor en Ingeniería Industrial con especialización en gestión de inventarios y optimización de cadenas de suministro.',
 '/assets/images/actividades/ponentes/Dr.MiguelMata.jpg',
 '/assets/images/actividades/banners/C1.png'),

('C2', 'Ingeniería en capas: cómo la manufactura aditiva construye el futuro',
 'Dra. Cynthia Graciela Flores Hernández', 'Instituto Tecnológico Superior de Coatzacoalcos',
 '2025-09-25 17:00:00', '2025-09-25 18:00:00',
 'Auditorio de Ingenierías Edificio G',
 'Cómo la impresión 3D está revolucionando procesos industriales mediante diseño funcional, materiales sostenibles y prototipado inteligente. Una mirada práctica a la manufactura aditiva en ingeniería industrial.',
 'Conferencia', 150, TRUE,
 'Doctora en Ingeniería Industrial especializada en manufactura aditiva y diseño para impresión 3D.',
 '/assets/images/actividades/ponentes/Dra.CynthiaFlores.jpg',
 '/assets/images/actividades/banners/C2.png'),

('C3', 'Del dato a la decisión: cómo pensar como un ingeniero y actuar como un financiero',
 'Lic. Aaron Zavala Serrano', 'Consultor Independiente',
 '2025-09-25 09:30:00', '2025-09-25 10:30:00',
 'Auditorio de Ingenierías Edificio G',
 'Gestión de operaciones desde una perspectiva financiera: ROI, flujo financiero y cómo las decisiones operativas se traducen en impactos directos en la rentabilidad y sostenibilidad.',
 'Conferencia', 150, TRUE,
 'Licenciado en Administración con especialización en finanzas corporativas y análisis de inversiones.',
 '/assets/images/actividades/ponentes/Lic.AaronZavala.jpg',
 '/assets/images/actividades/banners/C3.png'),

('F1', 'Foro de Estudiantes de Ingeniería',
 'Estudiantes de Ingeniería', 'Universidad del Caribe',
 '2025-09-25 14:30:00', '2025-09-25 15:30:00',
 'Auditorio de Ingenierías Edificio G',
 'Espacio de intercambio de experiencias y reflexiones sobre la formación y el ejercicio profesional.',
 'Foro', 150, TRUE,
 'Representantes estudiantiles de diferentes programas de ingeniería.',
 '/assets/images/actividades/ponentes/EstudiantesIngenieria.jpg',
 '/assets/images/actividades/banners/F1.png'),

('F2', 'Foro de Estudiantes de Postgrado',
 'Estudiantes de Postgrado', 'Universidad del Caribe',
 '2025-09-25 18:30:00', '2025-09-25 19:30:00',
 'Auditorio de Ingenierías Edificio G',
 'Mesa redonda con estudiantes de posgrado sobre investigación aplicada y desarrollo profesional.',
 'Foro', 150, TRUE,
 'Estudiantes de maestría y doctorado en ingeniería.',
 '/assets/images/actividades/ponentes/EstudiantesPosgrado.jpg',
 '/assets/images/actividades/banners/F2.png'),

('C4', '3 herramientas para un proyecto de vida',
 'Lic. Arturo Guzmán Contreras', 'Coach Profesional',
 '2025-09-26 13:00:00', '2025-09-26 14:00:00',
 'Auditorio de Ingenierías Edificio G',
 'Charla práctica para alinear metas con retos de la Ingeniería Industrial, fortalecer la toma de decisiones estratégicas y desarrollar liderazgo.',
 'Conferencia', 150, TRUE,
 'Licenciado en Administración con certificación internacional en coaching ejecutivo y desarrollo personal.',
 '/assets/images/actividades/ponentes/Lic.ArturoGuzman.jpg',
 '/assets/images/actividades/banners/C4.png'),

('C5', 'Mis obligaciones con el SAT en mi vida laboral — "Hasta que la muerte nos separe"',
 'Mtro. Fernando Pérez Castillo', 'Consultor Fiscal',
 '2025-09-26 12:00:00', '2025-09-26 13:00:00',
 'Auditorio de Ingenierías Edificio G',
 'Procedimientos y documentación para el cumplimiento de obligaciones fiscales al integrarse a la vida laboral.',
 'Conferencia', 150, TRUE,
 'Maestro en Administración Fiscal con más de 15 años de experiencia en consultoría tributaria.',
 '/assets/images/actividades/ponentes/Mtro.FernandoPerez.jpg',
 '/assets/images/actividades/banners/C5.png'),

('F3', 'Foro de Egresados',
 'Egresados', 'Universidad del Caribe',
 '2025-09-26 14:30:00', '2025-09-26 15:30:00',
 'Auditorio de Ingenierías Edificio G',
 'Encuentro de egresados para compartir trayectorias, aprendizajes y oportunidades de vinculación.',
 'Foro', 150, TRUE,
 'Egresados destacados de Ingeniería Industrial de diferentes generaciones.',
 '/assets/images/actividades/ponentes/Egresados.jpg',
 '/assets/images/actividades/banners/F3.png');

-- 6.5 Actividades – Workshops (25/09/2025 16:00–19:00)
INSERT INTO actividades (codigo, titulo, ponente, institucion, fecha_inicio, fecha_fin, lugar, descripcion, tipo, cupo_maximo, activa, bio_ponente, imagen_ponente, banner) VALUES
('W1', 'Introducción a la teoría de inventarios: de la teoría básica a la complejidad de la aplicación',
 'Dr. Miguel Mata Pérez', 'Universidad Autónoma de Nuevo León',
 '2025-09-25 16:00:00', '2025-09-25 19:00:00',
 'Laboratorio de Ingeniería de Métodos y Metrología (LIM)',
 'El control y mantenimiento de inventarios es fundamental en cualquier organización. Este taller aborda desde los conceptos básicos hasta la implementación práctica de modelos complejos.',
 'Workshop', 30, TRUE,
 'Doctor en Ingeniería Industrial con especialización en gestión de inventarios y optimización de cadenas de suministro.',
 '/assets/images/actividades/ponentes/Dr.MiguelMata.jpg',
 '/assets/images/actividades/banners/W1.png'),

('W2', 'Diseña, imprime, impacta - La manufactura aditiva transforma la ingeniería',
 'Dra. Cynthia Graciela Flores Hernández', 'Instituto Tecnológico Superior de Coatzacoalcos',
 '2025-09-25 16:00:00', '2025-09-25 19:00:00',
 'Laboratorio de Innovación y Manufactura Avanzada (LIMA)',
 'Principios del diseño para impresión 3D, tecnologías y materiales, y ejercicios prácticos de diseño e impresión.',
 'Workshop', 22, TRUE,
 'Doctora en Ingeniería Industrial especializada en manufactura aditiva y diseño para impresión 3D.',
 '/assets/images/actividades/ponentes/Dra.CynthiaFlores.jpg',
 '/assets/images/actividades/banners/W2.png'),

('W3', 'Introducción a la Ingeniería de empaque y embalaje',
 'Dr. Juan José Hurtado Moreno', 'UPIICSA IPN',
 '2025-09-25 16:00:00', '2025-09-25 19:00:00',
 'Laboratorio de Ingeniería de Métodos (LIME)',
 'Fundamentos de ingeniería de empaque: materiales, diseño estructural, pruebas y normativas internacionales.',
 'Workshop', 30, TRUE,
 'Doctor en Ingeniería Industrial especializado en diseño de empaques y sistemas de protección.',
 '/assets/images/actividades/ponentes/Dr.JuanHurtado.jpg',
 '/assets/images/actividades/banners/W3.png'),

('W4', 'Propiedades de las arenas de moldeo',
 'Dra. Martha Elva Pérez Ramos', 'TecNM Campus Querétaro',
 '2025-09-25 16:00:00', '2025-09-25 19:00:00',
 'Laboratorio de Ingeniería de Procesos Industriales (LIPI)',
 'Preparación, caracterización y control de calidad de arenas de moldeo. Pruebas de permeabilidad, resistencia y parámetros críticos.',
 'Workshop', 24, TRUE,
 'Doctora en Ingeniería de Materiales especializada en procesos de fundición.',
 '/assets/images/actividades/ponentes/Dra.MarthaPerez.jpg',
 '/assets/images/actividades/banners/W4.png'),

('W5', 'Modelado 3D y manuales interactivos de mantenimiento con iPhone Pro y JigSpace',
 'Dr. Alejandro Charbel Cárdenas León', 'Universidad del Caribe',
 '2025-09-25 16:00:00', '2025-09-25 19:00:00',
 'Laboratorio de Electrónica (LEL)',
 'Tecnologías de RA para manuales interactivos de mantenimiento con JigSpace e iPhone Pro.',
 'Workshop', 25, TRUE,
 'Doctor en Ingeniería Industrial especializado en RA para mantenimiento.',
 '/assets/images/actividades/ponentes/Dr.AlejandroCárdenas.jpg',
 '/assets/images/actividades/banners/W5.png'),

('W6', 'Fundamentos prácticos de circuitos eléctricos en Corriente Alterna',
 'M.E.R. Leslye Johanna Ramírez Carmona', 'Universidad del Caribe',
 '2025-09-25 16:00:00', '2025-09-25 19:00:00',
 'Laboratorio de Metrología Dimensional y Eléctrica',
 'Conceptos básicos, análisis de circuitos, mediciones y aplicaciones industriales en CA.',
 'Workshop', 20, TRUE,
 'Maestra en Energías Renovables e Ingeniera Mecánica Electricista.',
 '/assets/images/actividades/ponentes/Mtra.LeslyeRamírez.jpg',
 '/assets/images/actividades/banners/W6.png');

-- ========================================================
-- (7) NOTAS OPERATIVAS (opcional ejecutar)
-- ========================================================
-- Usa offset fijo de Cancún (UTC-05:00 todo el año)
SET time_zone = '-05:00';

-- Verifica
SELECT @@session.time_zone AS sesion, @@global.time_zone AS global;
SELECT NOW() AS ahora_local_según_sesión;
