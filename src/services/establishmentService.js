const Establishment = require("../models/establishmentModel");
const mongoose = require("mongoose");
const documentSchema = require("../models/documentModel");

exports.getEstablishments = async () => {
  return await Establishment.find()
    .populate("menu_items") // Populate the menu items
    .populate({
      path: "ratings",
      populate: {
        path: "user_id",
        select: "name avatar", // Only get user's name and avatar
      },
    });
};

exports.getEstablishmentById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid establishment ID");
  }

  const establishment = await Establishment.findById(id)
    .populate("menu_items")
    .populate({
      path: "ratings",
      populate: {
        path: "user_id",
        select: "name avatar",
      },
    });

  if (!establishment) {
    throw new Error("Establishment not found");
  }

  return establishment;
};

exports.createEstablishment = async (
  documentName,
  documentImage,
  establishmentImage,
  establishmentData
) => {
  // Ensure _id is set for the new establishment
  const establishment = new Establishment(establishmentData);
  // Validate required fields
  if (!establishment.name) throw new Error("Establishment name is required");
  if (!establishment.location) throw new Error("Location is required");
  if (!establishment.contact_number)
    throw new Error("Contact number is required");
  if (!establishment.email) throw new Error("Email is required");
  if (!establishment.operating_hours)
    throw new Error("Operating hours are required");
  if (!establishment.barangay) throw new Error("Barangay is required");
  if (!establishment.owner) throw new Error("Owner is required");

  establishment.image = establishmentImage;

  establishment.documents.push({
    name: documentName,
    image: documentImage,
  });

  return await establishment.save();
};

exports.updateEstablishment = async (updateData) => {
  if (!mongoose.Types.ObjectId.isValid(updateData._id)) {
    throw new Error("Invalid establishment ID");
  }
  const establishment = await Establishment.findByIdAndUpdate(
    updateData._id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate("menu_items");

  if (!establishment) {
    throw new Error("Establishment not found");
  }

  return establishment;
};

exports.deleteEstablishment = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid establishment ID");
  }

  const establishment = await Establishment.findByIdAndUpdate(id);

  if (!establishment) {
    throw new Error("Establishment not found");
  }

  return establishment;
};

exports.getEstablishmentByBarangay = async (barangay, status) => {
  return await Establishment.find({ barangay: barangay, status: status });
};

exports.uploadDocument = async ({ establishmentId, name, image }) => {
  const establishment = await Establishment.findById(establishmentId);
  if (!establishment) {
    throw new Error("Establishment not found");
  }
  const newDocument = {
    _id: new mongoose.Types.ObjectId(),
    name: name,
    image: image,
  };

  establishment.documents.push(newDocument);
  return await establishment.save();
};

/**
 * Search for establishments by name, food name, or food tags.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} - A promise that resolves to an array of establishments.
 */
exports.searchEstablishments = async (query) => {
  try {
    const regex = new RegExp(query, "i"); // Case-insensitive regex for partial matching

    const establishments = await Establishment.find({
      $or: [
        { name: regex },
        { "menu_items.name": regex },
        { "menu_items.tags": regex },
      ],
    });

    return establishments;
  } catch (error) {
    console.error("Error searching for establishments:", error);
    throw error;
  }
};

exports.incrementViews = async ({ _id }) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new Error("Invalid establishment ID");
  }

  return await Establishment.findByIdAndUpdate(
    _id,
    { $inc: { views: 1 } },
    { new: true }
  );
};

// Additional useful methods

// exports.searchEstablishments = async (query) => {
//     const searchRegex = new RegExp(query, 'i');
//     return await Establishment.find({
//         $or: [
//             { name: searchRegex },
//             { quisines: searchRegex }
//         ]
//     }).populate('menu_items');
// };

// exports.getNearbyEstablishments = async (coordinates, maxDistance = 5000) => {
//     return await Establishment.find({
//         location: {
//             $near: {
//                 $geometry: {
//                     type: 'Point',
//                     coordinates: coordinates // [longitude, latitude]
//                 },
//                 $maxDistance: maxDistance // in meters
//             }
//         }
//     }).populate('menu_items');
// };

// exports.addMenuItems = async (id, menuItemIds) => {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new Error('Invalid establishment ID');
//     }

//     return await Establishment.findByIdAndUpdate(
//         id,
//         { $addToSet: { menu_items: { $each: menuItemIds } } },
//         { new: true }
//     ).populate('menu_items');
// };

// exports.removeMenuItems = async (id, menuItemIds) => {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new Error('Invalid establishment ID');
//     }

//     return await Establishment.findByIdAndUpdate(
//         id,
//         { $pull: { menu_items: { $in: menuItemIds } } },
//         { new: true }
//     ).populate('menu_items');
// };

// exports.updateImages = async (id, imageUrls) => {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         throw new Error('Invalid establishment ID');
//     }

//     return await Establishment.findByIdAndUpdate(
//         id,
//         { $set: { images: imageUrls } },
//         { new: true }
//     );
// };
