const db = require('../db/database');

const PersonajeModel = {
  getAllOrderByCount: () => {
    return db.prepare('SELECT * FROM Personajes ORDER BY count DESC').all();
  },

  incrementCountByName: (personaje) => {
    const result = db
      .prepare('UPDATE Personajes SET count = count + 1 WHERE personaje = ?')
      .run(personaje);

    return { changes: result.changes };
  },

  restartCount: () => {
    const result = db.prepare('UPDATE Personajes SET count = 0').run();
    return { changes: result.changes };
  },

  getCountSum: () => {
    const total = db.prepare('SELECT SUM(count) AS total FROM Personajes').get().total;
    return total === null ? 0 : total;
  },
};

module.exports = PersonajeModel;
