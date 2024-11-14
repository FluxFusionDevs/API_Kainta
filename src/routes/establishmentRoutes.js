const express = require("express");
const router = express.Router();
const establishmentController = require("../controllers/establishmentController");

router.get("/get-establishments", establishmentController.getEstablishments);
router.get("/get-establishment/:id", establishmentController.getEstablishmentById);
router.post("/create-establishment", establishmentController.createEstablishment);
router.put("/update-establishment", establishmentController.updateEstablishment);
router.get("/get-barangays", establishmentController.getBarangays); // New route to get barangays


module.exports = router;

