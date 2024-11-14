const ratingService = require('../services/ratingService');

exports.createRating = async (req, res, next) => {
    try {
        const rating = await ratingService.createRating(req.body);
        res.status(201).json(rating);
    } catch (error) {
        next(error);
    }
}

exports.getRatingsByEstablishmentId = async (req, res, next) => {
    try {
        const ratings = await ratingService.getRatingsByEstablishmentId(req.params.establishmentId);
        res.json(ratings);
    } catch (error) {
        next(error);
    }
}

exports.updateRating = async (req, res, next) => {
    try {
        const updatedRating = await ratingService.updateRating(req.body);
        res.json(updatedRating);
    } catch (error) {
        next(error);
    }
}
