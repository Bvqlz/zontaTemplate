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
import { uploadProductImage, handleMulterErr } from '../middleware/fileUpload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts); //this will be removed
router.get('/categories', getCategories);

// Webhook route (will be registered separately in server.js with express.raw())
// router.post('/webhook', express.raw({ type: 'application/json' }), handleProductWebhook);

// Protected admin routes (must come before :identifier route)
router.get('/admin/stats', protect, getProductStats);
router.post('/admin', protect, uploadProductImage, handleMulterErr, createProduct);
router.put('/admin/:id', protect, uploadProductImage, handleMulterErr, updateProduct);
router.delete('/admin/:id', protect, deleteProduct);

// Public route with :identifier (must be last to avoid conflicts)
router.get('/:identifier', getProductById);
router.post('/checkout', createProductCheckout);

export default router;
export { handleProductWebhook }; // we export this here so that it can be imported and used in server.js for raw body parsing
