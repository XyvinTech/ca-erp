const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { ErrorResponse } = require('./errorHandler');
require('dotenv').config();

// Ensure upload directory exists
const createUploadDir = (folderPath) => {
    const fullPath = path.join(process.env.FILE_UPLOAD_PATH || './public/uploads', folderPath);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
    return fullPath;
};

// Configure storage for different upload types
const storage = {
    documents: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = createUploadDir('/documents');
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            // Create a custom filename with timestamp to prevent duplicates
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = path.extname(file.originalname);
            cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
    }),
    avatars: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = createUploadDir('/avatars');
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            // For avatars, use the user's ID as the filename
            const ext = path.extname(file.originalname);
            const filename = req.user ? `avatar-${req.user._id}${ext}` : `avatar-${Date.now()}${ext}`;
            cb(null, filename);
        },
    }),
    logos: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = createUploadDir('/logos');
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `company-logo${ext}`);
        },
    }),

       // Add storage for task files
        taskFiles: multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = createUploadDir('/taskFiles');
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = path.extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
};

// File filter to check file types
const fileFilter = (req, file, cb) => {
    // Define allowed mime types
    const allowedMimeTypes = {
        documents: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv',
            'application/zip',
            'application/x-zip-compressed',
            'image/jpeg',
            'image/png',
        ],
        avatars: ['image/jpeg', 'image/png', 'image/gif'],
        logos: ['image/jpeg', 'image/png', 'image/svg+xml'],
        taskFiles: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'image/jpeg', 'image/png', 'application/zip', 'application/x-zip-compressed'],
    };

    // Determine upload type based on route or request data
    let uploadType = 'documents';
    if (req.originalUrl.includes('avatars')) {
        uploadType = 'avatars';
    } else if (req.originalUrl.includes('logos') || req.originalUrl.includes('settings')) {
        uploadType = 'logos';
    }

    // Check if the file type is allowed
    if (allowedMimeTypes[uploadType].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new ErrorResponse(
                `File type not allowed. Allowed types for ${uploadType}: ${allowedMimeTypes[uploadType].join(
                    ', '
                )}`,
                400
            ),
            false
        );
    }
};

// Create multer instance with limits
const upload = (type = 'documents') => {
    return multer({
        storage: storage[type],
        limits: {
            fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5000000, // Default to 5MB
        },
        fileFilter,
    });
};

// Export multer upload middlewares for different file types
module.exports = {
    uploadDocument: upload('documents'),
    uploadAvatar: upload('avatars'),
    uploadLogo: upload('logos'),
     uploadTaskFile: upload('taskFiles'), 
}; 