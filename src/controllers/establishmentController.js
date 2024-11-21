const establishmentService = require("../services/establishmentService");
const axios = require("axios");
const { cleanAndParseJson } = require("../utils/formDataJsonCleaner");
exports.getEstablishments = async (req, res, next) => {
    try {
        const establishments = await establishmentService.getEstablishments();
        res.json(establishments);
    } catch (error) {
        next(error);
    }
}

exports.getEstablishmentById = async (req, res, next) => {
    try {
        const establishment = await establishmentService.getEstablishmentById(req.query._id);
        res.json(establishment);
    } catch (error) {
        next(error);
    }
}

exports.createEstablishment = async (req, res, next) => {
    try {
      
        // Parse the cleaned JSON string
        const jsonBody = cleanAndParseJson(req.body.jsonData);
        console.log(req.uploadedFile);
        const documentImage = req.uploadedFile.documentImage.path;
        const documentName = req.body.documentName
        const establishmentImage = req.uploadedFile.establishmentImage.path;

        const establishment = await establishmentService.createEstablishment(documentName, documentImage, establishmentImage, jsonBody);
        res.status(201).json(establishment);
    } catch (error) {
        console.error('Error creating establishment:', error);
        next(error);
    }
};

exports.updateEstablishment = async (req, res, next) => {
    try {
        const updatedEstablishment = await establishmentService.updateEstablishment(req.body);
        res.json(updatedEstablishment);
    } catch (error) {
        next(error);
    }
}

exports.deleteEstablishment = async (req, res, next) => {
    try {
        const deletedEstablishment = await establishmentService.deleteEstablishment(req.body._id);
        res.json(deletedEstablishment);
    } catch (error) {
        next(error);
    }
}


exports.getBarangays = async (req, res) => {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json`, {
            params: {
                query: "barangays in Cainta Rizal Philippines",
                key: process.env.GOOGLE_MAPS_API_KEY
            }
        });

        const barangays = response.data.results.map(place => place.name); // Extracting barangay names
        res.status(200).json(barangays);
    } catch (error) {
        console.error("Error fetching barangays:", error);
        res.status(500).json({ error: "Failed to fetch barangays" });
    }
};


exports.getEstablishmentByBarangay = async (req, res, next) => {
    try {
        const establishment = await establishmentService.getEstablishmentByBarangay(req.query._id);
        res.json(establishment);
    } catch (error) {
        next(error);
    }
}


exports.uploadDocument = async (req, res, next) => {
    try {
        req.body.image = req.uploadedFile.path;
        const document = await establishmentService.uploadDocument(req.body);
        res.json(document);
    } catch (error) {
        next(error);
    }
}

