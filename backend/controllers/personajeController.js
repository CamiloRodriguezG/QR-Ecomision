const PersonajeModel = require('../models/personajeModel');

const PersonajeController = {
  getAll: (req, res) => {
    try {
      const personajes = PersonajeModel.getAllOrderByCount();
      res.json(personajes);
    } catch (error) {
      console.error('Error al obtener personajes:', error);
      res.status(500).json({ error: 'Error al obtener personajes' });
    }
  },

  incrementCount: (req, res) => {
    try {
      const { personaje } = req.params;
      const result = PersonajeModel.incrementCountByName(personaje);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Personaje no encontrado' });
      }

      res.json({ message: `Count incrementado para ${personaje}` });
    } catch (error) {
      console.error('Error al incrementar count:', error);
      res.status(500).json({ error: 'Error al incrementar count' });
    }
  },

  restartCount: (req, res) => {
    try {
      const result = PersonajeModel.restartCount();
      res.json({ message: `Cuentas actualizadas: ${result.changes}` });
    } catch (error) {
      console.error('Error al reiniciar count:', error);
      res.status(500).json({ error: 'Error al reiniciar count' });
    }
  },

  getCountSum: (req, res) => {
    try {
      const result = PersonajeModel.getCountSum();
      res.json(result);
    } catch (error) {
      console.error('Error al obtener suma de contadores:', error);
      res.status(500).json({ error: 'Error interno' });
    }
  },
};

module.exports = PersonajeController;
