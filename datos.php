<?php
// Datos de conexión a la base de datos en Railway.app

$servername = "mysql.railway.internal";  // Ejemplo: containers-us-west-36.railway.app
$username = "root";            // Usuario de la base de datos
$password = "hbVNPuJtmkfcxsoOQZQuxxhfoyuznsbw";         // Contraseña de la base de datos
$dbname = "datos_baston";        // Nombre de la base de datos
$port = "3306";                 // Puerto de la base de datos (Railway)

$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Verificar la conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Verificar si los valores de los sensores fueron enviados
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtener los datos JSON enviados por Arduino
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);
    
    // Verificar si los datos son válidos
    if ($data && isset($data['lon']) && isset($data['lat']) && isset($data['pos']) && isset($data['ult'])) {
        // Preparar la consulta SQL para insertar los datos en la tabla `datos_baston`
        $stmt = $pdo->prepare("INSERT INTO datos_baston (longitud, latitud, posicion, ultrasonido) VALUES (:sensor1, :sensor2, :sensor3, :sensor4)");
        $stmt->execute([
            ':sensor1' => $data['lon'],
            ':sensor2' => $data['lat'],
            ':sensor3' => $data['pos'],
            ':sensor4' => $data['ult'],
        ]);
        
        // Responder con éxito
        echo json_encode(['status' => 'success', 'message' => 'Datos almacenados correctamente en datos_baston']);
    } else {
        // Responder con error si los datos no son válidos
        echo json_encode(['status' => 'error', 'message' => 'Datos inválidos']);
    }
} else {
    // Si no es una solicitud POST, devolver un mensaje de error
    echo json_encode(['status' => 'error', 'message' => 'Método de solicitud inválido']);
}

// Cerrar la conexión
$conn->close();
?>
