import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'zonta-scholarships',
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'raw', //allows for non image files
        public_id: (req, file) => {
            const timestamp = Date.now();
            const originalName = file.originalname.replace(/\.[^/.]+$/, ''); //removes file extension
            return `${originalName}-${timestamp}`;
        }
    }
})

// filter restricts the types of files that can be uploaded. So only pdf, doc, docx
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
        files: 2 // Max 2 files per upload
    }
})


export const uploadScholarshipDocs = upload.array('documents', 2);

// Separate storage configuration for product images
const productImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'zonta-products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        resource_type: 'image',
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
        public_id: (req, file) => {
            const timestamp = Date.now();
            const originalName = file.originalname.replace(/\.[^/.]+$/, '');
            return `${originalName}-${timestamp}`;
        }
    }
});

// Filter for image files only
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'), false);
    }
};

const productImageUpload = multer({
    storage: productImageStorage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
        files: 1 // Single image for featured image
    }
});

export const uploadProductImage = productImageUpload.single('image');

// Middleware for scholarship listings - handles both image and optional attachment
// Use dynamic params function to handle different file types
const scholarshipListingStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const timestamp = Date.now();
        const originalName = file.originalname.replace(/\.[^/.]+$/, '');
        
        if (file.fieldname === 'image') {
            return {
                folder: 'zonta-scholarship-listings',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                resource_type: 'image',
                transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
                public_id: `image-${originalName}-${timestamp}`
            };
        } else if (file.fieldname === 'attachment') {
            return {
                folder: 'zonta-scholarship-listings/attachments',
                allowed_formats: ['pdf', 'doc', 'docx'],
                resource_type: 'raw',
                public_id: `attachment-${originalName}-${timestamp}`
            };
        }
    }
});

const scholarshipListingFileFilter = (req, file, cb) => {
    if (file.fieldname === 'image') {
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid image type. Only JPG, JPEG, PNG, and WEBP are allowed.'), false);
        }
    } else if (file.fieldname === 'attachment') {
        const allowedDocTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedDocTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid attachment type. Only PDF, DOC, and DOCX are allowed.'), false);
        }
    } else {
        cb(new Error('Unexpected field name.'), false);
    }
};

const scholarshipListingUpload = multer({
    storage: scholarshipListingStorage,
    fileFilter: scholarshipListingFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB limit
        files: 2 // Max 2 files (1 image + 1 optional attachment)
    }
});

export const uploadMultipleFiles = scholarshipListingUpload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'attachment', maxCount: 1 }
]);

export const handleMulterErr = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false,
                error: 'File size is too large. Max size is 5MB.'
            });
        }

        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                error: 'File limit reached. Max 2 files allowed.'
            });
        }

        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                error: 'Unexpected field name. Please use "documents" as the field name.'
            });
        }

        return res.status(400).json({
            success: false,
            error: `File upload error: ${err.message}`
        });
    }

    if (err) {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }

    next();
};

// Export cloudinary for use in controllers (e.g., deleting files)
export { cloudinary };
