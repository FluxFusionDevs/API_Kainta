const express = require("express");
const router = express.Router();
const barangayController = require("../controllers/barangayController");
const { createUploadMiddleware } = require("../middleware/upload");

const renderPath = process.env.RENDER_UPLOAD_PATH;
const barangayUploadPath = process.env.NODE_ENV === "development" ? `${renderPath}/uploads/barangayImages` : "uploads/barangayImages";

const uploadBarangayImage = createUploadMiddleware({
  fields: [
    {
      directory: barangayUploadPath,
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
