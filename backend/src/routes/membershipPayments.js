import express from 'express';
import {
    createMembershipCheckout,
    handleMembershipWebhook,
    getPaymentSession
} from '../controllers/membershipPaymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/session/:sessionId', getPaymentSession);

// Protected admin routes
router.post('/create-checkout', protect, createMembershipCheckout);

export default router;
export { handleMembershipWebhook };
