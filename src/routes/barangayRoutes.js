const express = require("express");
const router = express.Router();
const barangayController = require("../controllers/barangayController");
const { createUploadMiddleware } = require("../middleware/upload");

const uploadBarangayImage = createUploadMiddleware({
  fields: [
    {
      directory: "uploads/barangayImages",
      filePrefix: "barangay",
      fieldName: "barangayImage",
      maxSize: 5 * 1024 * 1024, // 5MB
    },
  ],
});

router.get("/get-barangays", barangayController.getBarangays);
router.post("/create-barangays", barangayController.createBarangays);
router.put(
  "/upload-image",
  uploadBarangayImage,
  barangayController.uploadBarangayImage
);

module.exports = router;
