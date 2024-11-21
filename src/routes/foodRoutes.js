const express = require("express");
const router = express.Router();

const foodController = require("../controllers/foodController");
const { createUploadMiddleware } = require("../middleware/upload");


const uploadFoodImage = createUploadMiddleware({
    fields: [
        {
            directory: "uploads/foodImages",
            fieldName: "foodImage",
            filePrefix: "food",
            maxSize: 5 * 1024 * 1024 // 5MB
        }
    ]
});

router.post("/add", uploadFoodImage, foodController.addFoodItem);
router.delete("/delete", foodController.deleteFoodItem);
router.put("/update", uploadFoodImage, foodController.updateFoodItem);
router.get("/get", foodController.getFoodItem);
module.exports = router;