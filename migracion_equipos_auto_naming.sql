-- ========================================================
-- MIGRACIÓN: EQUIPOS_CONCURSO CON AUTO-NAMING
-- Actualiza la tabla existente para auto-generar nombres
-- ========================================================

USE jornada_ii_test; -- o jornada_ii_test para pruebas

-- 1. ELIMINAR TRIGGERS EXISTENTES
DROP TRIGGER IF EXISTS tr_equipos_concurso_bi;
DROP TRIGGER IF EXISTS tr_equipos_concurso_bu;

-- 2. ACTUALIZAR NOMBRES EXISTENTES (si hay datos)
UPDATE equipos_concurso ec
JOIN estados_mexico em ON ec.estado_id = em.id
SET ec.nombre_equipo = CONCAT('Equipo ', em.nombre)
WHERE ec.nombre_equipo IS NOT NULL;

-- 3. CREAR NUEVOS TRIGGERS CON AUTO-NAMING
DELIMITER //

-- Trigger para INSERT con auto-naming
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

-- Trigger para UPDATE con auto-naming
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

  -- Correos deben existir en participantes
  IF (SELECT COUNT(*) FROM participantes WHERE email IN
      (NEW.email_capitan, NEW.email_miembro_1, NEW.email_miembro_2, NEW.email_miembro_3, NEW.email_miembro_4, NEW.email_miembro_5)) <> 6 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Todos los correos del equipo deben existir en participantes';
  END IF;

  -- Tope si pasa a confirmado
  IF OLD.estado_registro<>'confirmado' AND NEW.estado_registro='confirmado' THEN
    SELECT CAST(valor AS UNSIGNED) INTO v_max FROM configuracion_sistema WHERE clave='max_equipos_concurso';
    SELECT COUNT(*) INTO v_confirmados FROM equipos_concurso WHERE estado_registro='confirmado';
    IF v_confirmados >= v_max THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT='Tope de equipos confirmados alcanzado';
    END IF;
  END IF;
END//

DELIMITER ;

-- 4. VERIFICACIÓN
SELECT 
  'Migración completada exitosamente' AS mensaje,
  COUNT(*) AS equipos_totales,
  COUNT(CASE WHEN nombre_equipo LIKE 'Equipo %' THEN 1 END) AS equipos_con_nuevo_formato
FROM equipos_concurso;

-- 5. MOSTRAR EQUIPOS ACTUALIZADOS
SELECT 
  ec.id,
  ec.nombre_equipo,
  em.nombre AS estado,
  ec.estado_registro
FROM equipos_concurso ec
JOIN estados_mexico em ON ec.estado_id = em.id
ORDER BY ec.nombre_equipo;