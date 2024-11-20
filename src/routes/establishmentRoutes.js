const express = require("express");
const router = express.Router();
const establishmentController = require("../controllers/establishmentController");
const { createUploadMiddleware } = require("../middleware/upload");

const uploadDocument = createUploadMiddleware({
    directory: 'uploads/documents',
    filePrefix: 'document',
    fieldName: 'image',
    maxSize: 5 * 1024 * 1024 // 5MB
});

router.get("/get-establishments", establishmentController.getEstablishments);
router.get("/get-establishment", establishmentController.getEstablishmentById);
router.post("/create-establishment", establishmentController.createEstablishment);
router.put("/update-establishment", establishmentController.updateEstablishment);
router.delete("/delete-establishment", establishmentController.deleteEstablishment);
router.get("/get-barangays", establishmentController.getBarangays); // New route to get barangays
router.get("/get-establishment-by-barangay", establishmentController.getEstablishmentByBarangay);
router.post("/upload-document", uploadDocument, establishmentController.uploadDocument);
module.exports = router;

