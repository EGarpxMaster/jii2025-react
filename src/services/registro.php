<?php
include 'conexion.php';
header('Content-Type: application/json');
// Iniciar sesión si no está iniciada
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
// Función para responder en formato JSON
function responderJSON($exito, $mensaje) {
    echo json_encode(['exito' => $exito, 'mensaje' => $mensaje]);
    exit;
}
// Conectar a la base de datos
$connection = serverCon();
// Verificar que la conexión se haya realizado correctamente
if ($connection === null) {
    responderJSON(false, "No se pudo establecer la conexión a la base de datos.");
}
// Función para verificar si un nombre ya existe en la base de datos
function nombreYaExiste($connection, $nombre) {
    $sql = "SELECT COUNT(*) FROM asistentes WHERE nombre_completo = ?";
    $stmt = $connection->prepare($sql);
    if (!$stmt) {
        return true;
    }
    $stmt->bind_param("s", $nombre);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    return $count > 0;
}
// Función para verificar si un correo ya existe en la base de datos
function correoYaExiste($connection, $correo) {
    $sql = "SELECT COUNT(*) FROM asistentes WHERE correo_electronico = ?";
    $stmt = $connection->prepare($sql);
    if (!$stmt) {
        return true;
    }
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();
    $stmt->close();
    return $count > 0;
}

// Función para insertar un asistente en la base de datos
function insertarAsistente($connection, $nombre, $telefono, $correo, $programa) {
    $sql = "INSERT INTO asistentes (nombre_completo, telefono, correo_electronico, programa_educativo)
            VALUES (?, ?, ?, ?)";
    $stmt = $connection->prepare($sql);
    if (!$stmt) {
        throw new Exception("Error en la preparación de la consulta de inserción.");
    }
    $stmt->bind_param("ssss", $nombre, $telefono, $correo, $programa);
    if (!$stmt->execute()) {
        throw new Exception("Error al ejecutar la inserción: " . $stmt->error);
    }
    $stmt->close();
}

// Verificar que se hayan enviado todos los datos necesarios
if (!isset($_POST['nombre'], $_POST['correo'], $_POST['telefono'], $_POST['programa'])) {
    responderJSON(false, "Faltan datos en el formulario.");
}
// Recoger y limpiar los datos del formulario
$nombre = strtoupper(trim($_POST['nombre']));
$correo = trim(strtolower($_POST['correo']));
$telefono = trim($_POST['telefono']);
$programa = trim($_POST['programa']);
// Validar que ningún campo esté vacío
if (empty($nombre) || empty($correo) || empty($telefono) || empty($programa)) {
    responderJSON(false, "Por favor, complete todos los campos correctamente.");
}
// Validar el formato del correo electrónico
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    responderJSON(false, "El correo electrónico no es válido.");
}
// Validar el número de teléfono (10 dígitos)
if (!preg_match('/^[0-9]{10}$/', $telefono)) {
    responderJSON(false, "El número de teléfono debe tener 10 dígitos.");
}
// Verificar si el nombre ya está registrado
if (nombreYaExiste($connection, $nombre)) {
    responderJSON(false, "Este nombre ya está registrado.");
}
// Verificar si el correo ya está registrado
if (correoYaExiste($connection, $correo)) {
    responderJSON(false, "Este correo electrónico ya está registrado.");
}
// Intentar insertar el asistente en la base de datos
try {
    insertarAsistente($connection, $nombre, $telefono, $correo, $programa);
    responderJSON(true, "¡Registro exitoso! Gracias por registrarte en la Jornada de Ingeniería Industrial.");
} catch (Exception $e) {
    responderJSON(false, $e->getMessage());
}
// Cerrar la conexión a la base de datos
$connection->close();
?>
