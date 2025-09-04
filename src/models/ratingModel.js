const db = require('../db/database');

const RatingModel = {
  saveRatings: (rating1, rating2, rating3) => {
    const result = db
      .prepare('INSERT INTO respuestas (rating1, rating2, rating3) VALUES (?, ?, ?)')
      .run(rating1, rating2, rating3);
    return { id: result.lastInsertRowid };
  },
  getAllRatings: () => {
    return db.prepare('SELECT * FROM respuestas').all();
  },
};

module.exports = RatingModel;
