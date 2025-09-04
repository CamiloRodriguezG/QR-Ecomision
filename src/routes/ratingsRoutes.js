const express = require('express');
const router = express.Router();
const RatingsController = require('../controllers/ratingsController');

router.post('/submit', RatingsController.submitRatings);
router.get('/all', RatingsController.getAllRatings);

module.exports = router;
