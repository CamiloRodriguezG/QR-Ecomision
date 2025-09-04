const express = require('express');
const router = express.Router();
const PersonajeController = require('../controllers/personajeController');

router.get('/', PersonajeController.getAll);

router.patch('/:personaje/increment', PersonajeController.incrementCount);

router.patch('/restart', PersonajeController.restartCount);

router.get('/totalAnswers', PersonajeController.getCountSum);

module.exports = router;
