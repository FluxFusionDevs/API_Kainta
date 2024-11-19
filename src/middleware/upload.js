const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Helper function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};


exports.createUploadMiddleware = ({ 
    directory = 'uploads', 
    fieldName = 'file',
    maxSize = 5 * 1024 * 1024 
} = {}) => {
    const uploadDir = path.join(__dirname, '../../', directory);
    ensureDirectoryExists(uploadDir);

    const getExtensionFromMimeType = (mimeType) => {
        const mimeToExt = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp',
            'image/svg+xml': '.svg'
        };
        return mimeToExt[mimeType] || '.jpg';
    };

    const fileFilter = (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    };

    // Use memory storage instead of disk storage
    const upload = multer({ 
        storage: multer.memoryStorage(),
        fileFilter: fileFilter,
        limits: {
            fileSize: maxSize
        }
    });

    return (req, res, next) => {
        upload.single(fieldName)(req, res, async (err) => {
            if (err) {
                return next(err instanceof multer.MulterError 
                    ? new Error(`Upload error: ${err.message}`) 
                    : err);
            }
            
            if (!req.file) {
                return next(new Error('Please select a file to upload'));
            }

            try {
                const id = req.body._id ?? uuidv4();
                if (!id) {
                    return next(new Error('id is required'));
                }

                const extension = getExtensionFromMimeType(req.file.mimetype);
                const filename = `${id}${extension}`;
                const filePath = path.join(uploadDir, filename);

                // Save file after body is available
                await fs.promises.writeFile(filePath, req.file.buffer);

                req.uploadedFile = {
                    filename,
                    path: `/${directory}/${filename}`,
                    originalname: req.file.originalname,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                };

                next();
            } catch (error) {
                next(error);
            }
        });
    };
};