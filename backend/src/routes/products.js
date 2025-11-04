import express from 'express';
import {
    getAllProducts,
    getProductById,
    getFeaturedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductCheckout,
    handleProductWebhook,
    getProductStats,
    getCategories
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);

// Webhook route (will be registered separately in server.js with express.raw())
// router.post('/webhook', express.raw({ type: 'application/json' }), handleProductWebhook);

// Protected admin routes (must come before :identifier route)
router.get('/admin/stats', protect, getProductStats);
router.post('/admin', protect, createProduct);
router.put('/admin/:id', protect, updateProduct);
router.delete('/admin/:id', protect, deleteProduct);

// Public route with :identifier (must be last to avoid conflicts)
router.get('/:identifier', getProductById);
router.post('/checkout', createProductCheckout);

export default router;
export { handleProductWebhook };
