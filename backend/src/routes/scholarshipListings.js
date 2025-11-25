import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadMultipleFiles } from '../middleware/fileUpload.js';
import {
    getAllScholarshipListings,
    getScholarshipListingById,
    createScholarshipListing,
    updateScholarshipListing,
    deleteScholarshipListing,
    getScholarshipStats
} from '../controllers/scholarshipListingController.js';

const router = express.Router();

// Public routes
router.get('/', getAllScholarshipListings);
router.get('/:identifier', getScholarshipListingById);

// Admin routes (protected)
router.post('/admin', protect, uploadMultipleFiles, createScholarshipListing);
router.put('/admin/:id', protect, uploadMultipleFiles, updateScholarshipListing);
router.delete('/admin/:id', protect, deleteScholarshipListing);
router.get('/admin/stats', protect, getScholarshipStats);

export default router;
