const foodService = require("../services/foodService");
const logger = require("../utils/logger");

exports.addFoodItem = async (req, res, next) => {
    try {
      const { establishmentId, name, tags, price, description } = req.body;
      
      // Validate required fields
      if (!establishmentId) {
        return res.status(400).json({ message: 'establishmentId is required' });
      }
  
      // Create foodItem object from request body
      const foodItem = {
        name,
        price,
        tags,
        description,
        image: req.uploadedFile.foodImage.path
      };
      

      const establishment = await foodService.addFoodItem(
        establishmentId,
        foodItem
      );
  
      res.status(201).json(establishment);
    } catch (error) {
      logger.error("Error in addFoodItem controller:", error);
      next(error);
    }
  };

  
exports.deleteFoodItem = async (req, res, next) => {
  try {
    const { establishmentId, foodItemId } = req.body;
    console.log(establishmentId, foodItemId);
    const establishment = await foodService.deleteFoodItem(
      establishmentId,
      foodItemId
    );
    res.json(establishment);
  } catch (error) {
    logger.error("Error in deleteFoodItem controller:", error);
    next(error);
  }
};

exports.updateFoodItem = async (req, res, next) => {
  try {
    const { establishmentId, foodItemId, foodItem } = req.body;
    const establishment = await foodService.updateFoodItem(
      establishmentId,
      foodItemId,
      foodItem
    );
    res.json(establishment);
  } catch (error) {
    logger.error("Error in updateFoodItem controller:", error);
    next(error);
  }
};

exports.getFoodItem = async (req, res, next) => {
  try {
    const { establishmentId, foodItemId } = req.params;
    const establishment = await foodService.getFoodItem(
      establishmentId,
      foodItemId
    );
    res.json(establishment);
  } catch (error) {
    logger.error("Error in getFoodItem controller:", error);
    next(error);
  }
};
