const Barangay = require("../models/barangayModel");

exports.createBarangays = async (barangayNames) => {
    return await Barangay.insertMany(barangayNames.map(name => ({ name })));
};

exports.getBarangays = async () => {
    return await Barangay.find();
};

exports.uploadBarangayImage = async (barangayId, imageUrl) => {
    return await Barangay.findByIdAndUpdate(barangayId, { image: imageUrl }, { new: true });
}
