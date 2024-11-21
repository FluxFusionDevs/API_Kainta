const userService = require("../services/userService");
const logger = require("../utils/logger");

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
      // Update user with new avatar URL
      const user = await userService.updateUserAvatar(userId, req.uploadedFile.profileImage.path);
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

  exports.loginWithEmailAndPassword = async (req, res, next) => {
    try {
      const token = await userService.loginWithEmailAndPassword(req.body);
      if (!token) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      res.json(token);
    } catch (error) {
      next(error);
    }
  }

  exports.registerWithEmailAndPassword = async (req, res, next) => {
    try {
      const user = await userService.registerWithEmailAndPassword(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
