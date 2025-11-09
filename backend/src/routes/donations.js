import express from 'express';
import {
    createCheckoutSession,
    handleWebhook,
    cancelDonation,
    getAllDonations,
    getDonationById,
    getDonationBySessionId,
    getDonationStats,
    exportDonations,
    cleanupOldDonations
} from '../controllers/donationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/create-checkout', createCheckoutSession);
router.get('/session/:sessionId', getDonationBySessionId);
router.post('/cancel/:donationId', cancelDonation);

// Webhook route (must be RAW body, not JSON)
// This will be registered separately in server.js with express.raw()
// router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected admin routes
router.get('/', protect, getAllDonations);
router.get('/stats', protect, getDonationStats);
router.get('/export', protect, exportDonations);
router.post('/cleanup', protect, cleanupOldDonations);
router.get('/:id', protect, getDonationById);

export default router;
export { handleWebhook };
