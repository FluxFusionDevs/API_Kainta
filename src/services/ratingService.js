const Establishment = require('../models/establishmentModel');

exports.createRating = async ({ userId, establishmentId, rating, comment }) => {
  const establishment = await Establishment.findById(establishmentId);
  if (!establishment) {
    throw new Error('Establishment not found');
  }
  establishment.ratings.push({ user_id: userId, rating: rating, comment: comment, establishment_id: establishmentId });
  await establishment.save();
  return establishment;
};

exports.getRatingsByEstablishmentId = async (establishmentId) => {
  const establishment = await Establishment.findById(establishmentId);
  return establishment.ratings;
};

exports.updateRating = async ({ userId, rating, comment, establishmentId }) => {
  const updatedRating = await Establishment.findOneAndUpdate(
    { 
      'ratings.user_id': userId, 
      'ratings.establishment_id': establishmentId 
    },
    { $set: { 'ratings.$.rating': rating, 'ratings.$.comment': comment } },
    { new: true }
  );
  return updatedRating;
};

