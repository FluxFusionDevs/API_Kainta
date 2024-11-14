const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../../uploads/profilePics');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);  // Use the absolute path
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});


// Configure file filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Create upload middleware
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});

// Single file upload handler
exports.uploadSingleImage = async (req, res, next) => {
    try {
        upload.single('profileImage')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return next(new Error('File upload error: ' + err.message));
            }
            
            if (!req.file) {
                return next(new Error('Please upload a file'));
            }
            
            next();
            // // File uploaded successfully
            // res.json({
            //     message: 'File uploaded successfully',
            //     file: req.file
            // });
        });
    } catch (error) {
        next(error);
    }
};

// Multiple files upload handler
exports.uploadMultipleImages = async (req, res, next) => {
    try {
        upload.array('images', 5)(req, res, async (err) => {  // 5 is max number of files
            if (err instanceof multer.MulterError) {
                return next(new Error('File upload error: ' + err.message));
            }

            if (!req.files || req.files.length === 0) {
                return next(new Error('Please upload files'));
            }

            res.json({
                message: 'Files uploaded successfully',
                files: req.files
            });
        });
    } catch (error) {
        next(error);
    }
};