const User = require('../models/userModel');

exports.getUsers = async () => {
    return await User.find({});
};

exports.getUserById = async (id) => {
    return await User.findById(id);
};

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email: email });
};

exports.createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

exports.updateUserAvatar = async (id, avatarUrl) => {
    console.log("Avatar URL: ", avatarUrl);
    return await User.findByIdAndUpdate(id, { avatar: avatarUrl }, { new: true });
};


exports.findOrCreateUser = async (profile) => {
    const { id, emails, displayName, picture } = profile;
    const email = emails[0].value; // Get the primary email

    // Check if the user already exists by email
    let user = await User.findOne({ email: email });

    if (!user) {
        // If user does not exist, create a new user
        user = new User({
            googleId: id, // Store the Google ID for future reference
            email: email,
            name: displayName,
            password: null, // No password for Google users
            type: 'OWNER',
            account_type: 'GOOGLE', // Set account_type to 'GOOGLE'
            avatar: picture,
            // Add any other fields you want to store
        });

        await user.save(); // Save the new user to the database
    }

    return user; // Return the found or created user
}

exports.findGoogleUser = async (id) => {
    return await User.findOne({ googleId: id });
};

exports.findAppleUser = async (id) => {
    return await User.findOne({ appleId: id });
};


exports.addFavoriteEstablishment = async ({ userId, establishmentId }) => {
    return await User.findByIdAndUpdate(userId, { $addToSet: { favoriteEstablishments: establishmentId } }, { new: true });
};

exports.removeFavoriteEstablishment = async ({ userId, establishmentId }) => {
    return await User.findByIdAndUpdate(userId, { $pull: { favoriteEstablishments: establishmentId } }, { new: true });
};

