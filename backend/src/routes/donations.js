import express from 'express';
import {
    createCheckoutSession,
    handleWebhook,
    getAllDonations,
    getDonationById,
    getDonationBySessionId,
    getDonationStats,
    exportDonations
} from '../controllers/donationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/create-checkout', createCheckoutSession);
router.get('/session/:sessionId', getDonationBySessionId);

// Webhook route (must be RAW body, not JSON)
// This will be registered separately in server.js with express.raw()
// router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected admin routes
router.get('/', protect, getAllDonations);
router.get('/stats', protect, getDonationStats);
router.get('/export', protect, exportDonations);
router.get('/:id', protect, getDonationById);

export default router;
export { handleWebhook };
