const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Helper function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Factory function to create upload middleware
exports.createUploadMiddleware = ({ 
    directory = 'uploads', 
    filePrefix = 'file',
    fieldName = 'file',
    maxSize = 5 * 1024 * 1024 // 5MB default
} = {}) => {
    // Create absolute path for upload directory
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
        return mimeToExt[mimeType] || '.jpg'; // Default to .jpg if unknown
    };
    
    // Configure storage
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const userId = req.body._id;
            const extension = getExtensionFromMimeType(file.mimetype);
            cb(null, `${userId}${extension}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    };

    const upload = multer({ 
        storage: storage,
        fileFilter: fileFilter,
        limits: {
            fileSize: maxSize
        }
    });

    // Return middleware
    return (req, res, next) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return next(new Error(`Upload error: ${err.message}`));
            } else if (err) {
                return next(err);
            }
            
            if (!req.file) {
                return next(new Error('Please select a file to upload'));
            }

            // Add the file path to the request object
            req.uploadedFile = {
                filename: req.file.filename,
                path: `/${directory}/${req.file.filename}`,
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            };
            
            next();
        });
    };
};