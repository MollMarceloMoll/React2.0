/*import mysql from "mysql2/promise";

// 1 - Creamos un poll de conexiones
const pool = mysql.createPool({
    host: "localhost", // Dirección del servidor MySQL
    user: "root", // Usuario de MySQL
    password: "root", // Contraseña de MySQL
    database: "forrajeria_db", // Nombre de la base de datos
    waitForConnections: true, // Espera si todas las conexiones están ocupadas
    connectionLimit: 10, // Maximo de conexiones simultaneas
    queueLimit: 0 // Sin limite de peticiones en cola
});

// 2 - Exportamos el poll para usarlo en las rutas
export default pool;*/
import mysql from "mysql2/promise";

// Usamos las variables de entorno que Railway inyectará automáticamente
const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Railway nos dará el host
    user: process.env.DB_USER,         // Railway nos dará el usuario
    password: process.env.DB_PASS,     // Railway nos dará la contraseña
    database: process.env.DB_NAME,     // Railway nos dará el nombre de la DB
    port: process.env.DB_PORT || 3306, // Añadimos el puerto por seguridad
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;