const express = require("express");
const router = express.Router();
const establishmentController = require("../controllers/establishmentController");
const { createUploadMiddleware } = require("../middleware/upload");

const uploadFiles = createUploadMiddleware({
  fields: [
    {
      directory: "uploads/documents",
      filePrefix: "document",
      fieldName: "documentImage",
      maxSize: 5 * 1024 * 1024, // 5MB
    },
    {
      directory: "uploads/establishments",
      filePrefix: "establishment",
      fieldName: "establishmentImage",
      maxSize: 5 * 1024 * 1024, // 5MB
    },
  ],
});

const uploadEstablishmentImage = createUploadMiddleware({
  fields: [
    {
      directory: "uploads/establishments",
      filePrefix: "establishment",
      fieldName: "establishmentImage",
      maxSize: 25 * 1024 * 1024, // 25MB
    },
  ],
});

router.get("/get-establishments", establishmentController.getEstablishments);
router.get("/get-establishment", establishmentController.getEstablishmentById);
router.post(
  "/create-establishment",
  uploadFiles,
  establishmentController.createEstablishment
);
router.put(
  "/update-establishment",
  uploadEstablishmentImage,
  establishmentController.updateEstablishment
);
router.delete(
  "/delete-establishment",
  establishmentController.deleteEstablishment
);
router.get("/get-barangays", establishmentController.getBarangays); // New route to get barangays
router.get(
  "/get-establishment-by-barangay",
  establishmentController.getEstablishmentByBarangay
);

router.get(
  "/search-establishments",
  establishmentController.searchEstablishments
);

router.put('/update-image', uploadEstablishmentImage, establishmentController.updateImage);

router.post("/increment-views", establishmentController.incrementViews);

// router.post("/upload-document", uploadDocument, establishmentController.uploadDocument);
module.exports = router;
