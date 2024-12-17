const ratingService = require("../services/ratingService");

exports.createRating = async (req, res, next) => {
  try {
    if (
      req.uploadedFile &&
      req.uploadedFile.ratingImages &&
      req.uploadedFile.ratingImages.length > 0
    ) {
      req.body.images = req.uploadedFile.ratingImages.map((file) => file.path);
    }
    const newRating = await ratingService.createRating(req.body);
    res.status(201).json(newRating);
  } catch (error) {
    next(error);
  }
};

exports.getRatingsByEstablishmentId = async (req, res, next) => {
  try {
    const ratings = await ratingService.getRatingsByEstablishmentId(
      req.params.establishmentId
    );
    res.json(ratings);
  } catch (error) {
    next(error);
  }
};

exports.updateRating = async (req, res, next) => {
  try {
    const updatedRating = await ratingService.updateRating(req.body);
    res.json(updatedRating);
  } catch (error) {
    next(error);
  }
};

exports.deleteRating = async (req, res, next) => {
  try {
    const deletedRating = await ratingService.deleteRating(req.body);
    res.json(deletedRating);
  } catch (error) {
    next(error);
  }
};
