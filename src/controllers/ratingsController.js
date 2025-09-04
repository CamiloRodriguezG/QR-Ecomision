const RatingsModel = require('../models/ratingModel');
const { getAll } = require('./personajeController');

const RatingsController = {
  submitRatings: (req, res) => {
    try {
      const { rating1, rating2, rating3 } = req.body;

      if (rating1 == null || rating2 == null || rating3 == null) {
        return res.status(400).json({ error: 'Todos las calificaciones son obligatorios' });
      }

      RatingsModel.saveRatings(rating1, rating2, rating3);
      res.json({ message: 'Calificaciones guardadas correctamente' });
    } catch (error) {
      console.error('Error al guardar ratings:', error);
      res.status(500).json({ error: 'Error al guardar ratings' });
    }
  },
  getAllRatings: (req, res) => {
    try {
      const ratings = RatingsModel.getAllRatings();
      res.json(ratings);
    } catch (error) {
      console.error('Error al obtener ratings:', error);
      res.status(500).json({ error: 'Error al obtener ratings' });
    }
  }
};

module.exports = RatingsController;
