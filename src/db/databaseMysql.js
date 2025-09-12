const mysql = require('mysql2/promise');

// Conexión a MySQL
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'tu_usuario',
  password: 'tu_password',
  database: 'tu_base_de_datos'
});

console.log('Conectado a MySQL');

// Crear tablas si no existen
await db.execute(`
  CREATE TABLE IF NOT EXISTS Personajes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    personaje VARCHAR(255) NOT NULL,
    count INT DEFAULT 0
  )
`);

await db.execute(`
  CREATE TABLE IF NOT EXISTS respuestas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    rating1 FLOAT,
    rating2 FLOAT,
    rating3 FLOAT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insertar datos iniciales solo si la tabla está vacía
const [rows] = await db.execute('SELECT COUNT(*) AS total FROM Personajes');
if (rows[0].total === 0) {
  const personajesIniciales = [
    ['Lucian', 0],
    ['Naira', 0],
    ['Lucas', 0],
    ['Lira', 0],
  ];
  await db.query(
    'INSERT INTO Personajes (personaje, count) VALUES ?',
    [personajesIniciales]
  );
  console.log('Datos iniciales insertados');
}

module.exports = db;
