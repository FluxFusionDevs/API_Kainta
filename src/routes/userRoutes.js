const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const { createUploadMiddleware } = require("../middleware/upload");

const router = express.Router();

const renderPath = process.env.RENDER_UPLOAD_PATH;
const renderUploadPath = process.env.NODE_ENV === "development" ? `${renderPath}/uploads/profilePics` : "uploads/profilePics";
const uploadAvatar = createUploadMiddleware({
  fields: [
    {
      directory: renderUploadPath,
      fieldName: "profileImage",
      maxSize: 5 * 1024 * 1024, // 5MB
    },
  ],
});

router.post("/create-user", userController.createUser);
router.get("/all-users", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/upload-avatar", uploadAvatar, userController.updateUserAvatar);
router.post(
  "/add-favorite-establishment",
  userController.addFavoriteEstablishment
);
router.post(
  "/remove-favorite-establishment",
  userController.removeFavoriteEstablishment
);


module.exports = router;
