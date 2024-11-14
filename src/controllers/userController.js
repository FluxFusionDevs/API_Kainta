const userService = require("../services/userService");
const logger = require("../utils/logger");
const { uploadSingleImage } = require("./uploadController");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    logger.error("Error in getUsers controller:", error);
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    logger.error("Error in createUser controller:", error);
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    logger.error("Error in getUserById controller:", error);
    next(error);
  }
};

exports.updateUserAvatar = async (req, res, next) => {
    try {
      const userId = req.body._id;
      const fileExtension = req.file.filename.split('.').pop();
      // Create the avatar URL path from the uploaded file
      const avatarUrl = `/uploads/profilePics/${userId}.${fileExtension}`;
      // Update user with new avatar URL
      const user = await userService.updateUserAvatar(userId, avatarUrl);
      res.json(user);
    } catch (error) {
      logger.error("Error in updateUserAvatar controller:", error);
      next(error);
    }
  };
  
  exports.addFavoriteEstablishment = async (req, res, next) => {
    try {
      const user = await userService.addFavoriteEstablishment(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  exports.removeFavoriteEstablishment = async (req, res, next) => {
    try {
      const user = await userService.removeFavoriteEstablishment(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
