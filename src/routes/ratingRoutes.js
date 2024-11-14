const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
router.post('/create-rating', ratingController.createRating);
router.get('/:establishmentId', ratingController.getRatingsByEstablishmentId);
router.put('/update-rating', ratingController.updateRating);

module.exports = router;
