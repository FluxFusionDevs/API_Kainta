const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

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
    console.log("MIME:", mimeType);
    return mimeToExt[mimeType] || ".jpg";
  };

  const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  };

  // Use memory storage instead of disk storage
  const maxFileSize = Math.max(
    ...fields.map((field) => field.maxSize || 5 * 1024 * 1024)
  );

  const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: {
      fileSize: maxFileSize, // Use the max file size from fields
    },
  });

  const multerFields = fields.map((field) => ({
    name: field.fieldName,
    maxCount: 10,
  }));

  return (req, res, next) => {
    // console.log(req.form);
    // console.log('Request headers:', req.headers);
    // console.log('Content-Type:', req.headers['content-type']);
    // console.log("Received files:", req.files);
    // console.log("Received body:", req.body);
    req.uploadedFile = req.uploadedFile || {};
    const timeout = setTimeout(() => {
      next(new Error("Request upload timed out"));
    }, 10000); // 10 seconds timeout
    upload.fields(multerFields)(req, res, async (err) => {
      clearTimeout(timeout);
        console.log("Received files:", req.files);

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

          const id = req.body._id ?? uuidv4();
          if (!id) {
            return next(new Error("id is required"));
          }

          const uploadDir = path.join(__dirname, "../../", field.directory);
          ensureDirectoryExists(uploadDir);

          req.uploadedFile[field.fieldName] = [];

          for (const file of fieldFiles) {
            const id2 = uuidv4();
            const extension = getExtensionFromMimeType(file.mimetype);
            const filename = `${id}-${id2}${extension}`;
            const filePath = path.join(uploadDir, filename);

            // Save file
            await fs.promises.writeFile(filePath, file.buffer, { flag: "w" });

            // Store file info
            req.uploadedFile[field.fieldName].push({
              filename,
              path: `/${field.directory}/${filename}`,
              originalname: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            });
          }
        }

        next();
      } catch (error) {
        next(error);
      }
    });
  };
};
