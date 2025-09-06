const path = require('path');
const Database = require('better-sqlite3');

// Asegura ruta absoluta: crea src/db/personajes.db
const dbPath = path.join(__dirname, 'personajes.db');
// const db = new Database(dbPath, { verbose: console.log });
const db = new Database(dbPath);

console.log('Conectado a SQLite');

// Crear tablas si no existen
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS Personajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personaje TEXT NOT NULL,
    count INTEGER DEFAULT 0
  )
`
).run();

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS respuestas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating1 REAL,
    rating2 REAL,
    rating3 REAL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`
).run();

// Insertar datos iniciales solo si la tabla está vacía
const count = db.prepare('SELECT COUNT(*) AS total FROM Personajes').get().total;
if (count === 0) {
  const insert = db.prepare('INSERT INTO Personajes (personaje, count) VALUES (?, ?)');
  const personajesIniciales = [
    ['Lucian', 0],
    ['Naira', 0],
    ['Lucas', 0],
    ['Lira', 0],
  ];
  const insertMany = db.transaction((personajes) => {
    for (const p of personajes) insert.run(p[0], p[1]);
  });
  insertMany(personajesIniciales);
  console.log('Datos iniciales insertados');
}

module.exports = db;
