const express = require("express");
const router = express.Router();

const foodController = require("../controllers/foodController");
const { createUploadMiddleware } = require("../middleware/upload");


const renderPath = process.env.RENDER_UPLOAD_PATH;
const renderUploadPath = process.env.NODE_ENV === "development" ? `${renderPath}/uploads/foodImages` : "uploads/foodImages";

const uploadFoodImage = createUploadMiddleware({
  fields: [
    {
      directory: renderUploadPath,
      filePrefix: "food",
      fieldName: "foodImage",
      maxSize: 5 * 1024 * 1024, // 5MB
    },
  ],
});


router.post("/add", uploadFoodImage, foodController.addFoodItem);
router.delete("/delete", foodController.deleteFoodItem);
router.put("/update", uploadFoodImage, foodController.updateFoodItem);
router.get("/get", foodController.getFoodItem);
module.exports = router;