import mysql from "mysql2/promise";

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
export default pool;