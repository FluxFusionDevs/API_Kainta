const Establishment = require("../models/establishmentModel");

exports.createRating = async ({
  userId,
  establishmentId,
  rating,
  comment,
  images,
}) => {
  const establishment = await Establishment.findById(establishmentId);
  if (!establishment) {
    throw new Error("Establishment not found");
  }
  establishment.ratings.push({
    user_id: userId,
    rating: rating,
    comment: comment,
    establishment_id: establishmentId,
    images: images,
  });
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
      "ratings.user_id": userId,
      "ratings.establishment_id": establishmentId,
    },
    { $set: { "ratings.$.rating": rating, "ratings.$.comment": comment } },
    { new: true }
  );
  return updatedRating;
};

exports.deleteRating = async ({ establishmentId, _id }) => {
  const establishment = await Establishment.findOneAndUpdate(
    { _id: establishmentId },
    { $pull: { ratings: { _id } } },
    { new: true }
  );
  if (!establishment) {
    throw new Error("Rating not found");
  }
  return establishment;
};
