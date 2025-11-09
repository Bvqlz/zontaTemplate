import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductCheckout,
    getOrderBySessionId,
    cancelOrder,
    handleProductWebhook,
    getProductStats,
    getCategories,
    getAllOrders,
    getOrderStats,
    exportOrders
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadProductImage, handleMulterErr } from '../middleware/fileUpload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.post('/checkout', createProductCheckout);
router.get('/session/:sessionId', getOrderBySessionId);
router.post('/cancel/:orderId', cancelOrder);

// Webhook route (will be registered separately in server.js with express.raw())
// router.post('/webhook', express.raw({ type: 'application/json' }), handleProductWebhook);

// Protected admin routes (must come before :identifier route)
router.get('/admin/stats', protect, getProductStats);
router.get('/admin/orders', protect, getAllOrders);
router.get('/admin/orders/stats', protect, getOrderStats);
router.get('/admin/orders/export', protect, exportOrders);
router.post('/admin', protect, uploadProductImage, handleMulterErr, createProduct);
router.put('/admin/:id', protect, uploadProductImage, handleMulterErr, updateProduct);
router.delete('/admin/:id', protect, deleteProduct);

// Public route with :identifier (must be last to avoid conflicts)
router.get('/:identifier', getProductById);

export default router;
export { handleProductWebhook }; // we export this here so that it can be imported and used in server.js for raw body parsing
