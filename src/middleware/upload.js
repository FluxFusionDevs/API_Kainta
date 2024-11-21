const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Helper function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

exports.createUploadMiddleware = ({ fields = [] } = {}) => {
  fields.forEach((field) => {
    const uploadDir = path.join(__dirname, "../../", field.directory);
    ensureDirectoryExists(uploadDir);
  });

  const getExtensionFromMimeType = (mimeType) => {
    const mimeToExt = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "image/svg+xml": ".svg",
    };
    return mimeToExt[mimeType] || ".jpg";
  };

  const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  };

  // Use memory storage instead of disk storage
  const maxFileSize = Math.max(...fields.map(field => field.maxSize || 5 * 1024 * 1024));

  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: {
      fileSize: maxFileSize, // Use the max file size from fields
    },
  });

  const multerFields = fields.map((field) => ({
    name: field.fieldName,
    maxCount: 1,
  }));

  return (req, res, next) => {
    req.uploadedFile = req.uploadedFile || {};

    upload.fields(multerFields)(req, res, async (err) => {
      if (err) {
        return next(
          err instanceof multer.MulterError
            ? new Error(`Upload error: ${err.message}`)
            : err
        );
      }

      try {
        // Process each field
        for (const field of fields) {
          const fieldFiles = req.files?.[field.fieldName];
          if (!fieldFiles || !fieldFiles[0]) {
            continue; // Skip if no file for this field
          }

          const file = fieldFiles[0];
          const id = req.body._id ?? uuidv4();
          if (!id) {
            return next(new Error("id is required"));
          }

          const uploadDir = path.join(__dirname, "../../", field.directory);
          ensureDirectoryExists(uploadDir);

          const extension = getExtensionFromMimeType(file.mimetype);
          const filename = `${id}${extension}`;
          const filePath = path.join(uploadDir, filename);

          // Save file
          await fs.promises.writeFile(filePath, file.buffer);

          // Store file info
          req.uploadedFile[field.fieldName] = {
            filename,
            path: `/${field.directory}/${filename}`,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          };
        }

        next();
      } catch (error) {
        next(error);
      }
    });
  };
};
