const barangayService = require("../services/barangayService");
const logger = require("../utils/logger");


exports.getBarangays = async (req, res) => {
    try {
        const barangays = await barangayService.getBarangays();
        res.json(barangays);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}

exports.createBarangays = async (req, res) => {
    const barangayNames = req.body; // Expecting an array of strings

    if (!Array.isArray(barangayNames)) {
        return res.status(400).json({ error: "Input must be an array of barangay names." });
    }

    try {
        const barangays = await barangayService.createBarangays(barangayNames);
        res.status(201).json(barangays);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

exports.uploadBarangayImage = async (req, res) => {
    try {
        const barangayId = req.body._id;
        const imageUrl = req.uploadedFile.barangayImage[0].path;
        const barangay = await barangayService.uploadBarangayImage(barangayId, imageUrl);
        res.json(barangay);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}