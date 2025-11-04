import Product from '../models/product.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Get all products (public - only active products)
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
    try {
        const { category, featured, status, search, sortBy = '-createdAt' } = req.query;
        
        const query = {};
        
        // For admin, show all products. For public, only active
        if (req.user) {
            if (status) query.status = status;
        } else {
            query.status = 'active';
        }
        
        if (category) query.category = category;
        if (featured === 'true') query.featured = true;
        if (search) {
            query.$text = { $search: search };
        }
        
        const products = await Product.find(query)
            .sort(sortBy)
            .lean();
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products'
        });
    }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:identifier
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const { identifier } = req.params;
        
        // Try to find by ID first, then by slug
        let product = await Product.findById(identifier);
        if (!product) {
            product = await Product.findOne({ slug: identifier });
        }
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        // Increment views
        product.views += 1;
        await product.save();
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch product'
        });
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.getFeaturedProducts();
        
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch featured products'
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'A product with this SKU or slug already exists'
            });
        }
        
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to create product'
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to update product'
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete product'
        });
    }
};

// @desc    Create Stripe checkout session for product purchase
// @route   POST /api/products/checkout
// @access  Public
export const createProductCheckout = async (req, res) => {
    try {
        const { productId, quantity = 1, customerEmail, customerName } = req.body;
        
        // Validate input
        if (!productId || !customerEmail || !customerName) {
            return res.status(400).json({
                success: false,
                error: 'Product ID, customer email, and name are required'
            });
        }
        
        // Get product
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        // Check if product is available
        if (!product.isAvailable()) {
            return res.status(400).json({
                success: false,
                error: 'Product is not available for purchase'
            });
        }
        
        // Check inventory
        if (product.trackInventory && !product.allowBackorder && product.inventory < quantity) {
            return res.status(400).json({
                success: false,
                error: `Only ${product.inventory} items available in stock`
            });
        }
        
        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: customerEmail,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.name,
                            description: product.shortDescription || product.description.substring(0, 200),
                            images: product.featuredImage ? [product.featuredImage] : []
                        },
                        unit_amount: Math.round(product.price * 100) // Convert to cents
                    },
                    quantity: quantity
                }
            ],
            success_url: `${process.env.FRONTEND_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/shop`,
            metadata: {
                productId: product._id.toString(),
                productName: product.name,
                quantity: quantity.toString(),
                customerName
            }
        });
        
        res.json({
            success: true,
            sessionId: session.id,
            url: session.url
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create checkout session'
        });
    }
};

// @desc    Handle Stripe webhook for product purchases
// @route   POST /api/products/webhook
// @access  Public (Stripe only)
export const handleProductWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        
        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                
                // Get product and decrease inventory
                const productId = session.metadata.productId;
                const quantity = parseInt(session.metadata.quantity);
                
                const product = await Product.findById(productId);
                if (product) {
                    await product.decreaseInventory(quantity);
                    console.log(`Inventory decreased for product: ${product.name}, Quantity: ${quantity}`);
                }
                break;
                
            case 'payment_intent.payment_failed':
                console.log('Payment failed:', event.data.object);
                break;
                
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        
        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

// @desc    Get product statistics
// @route   GET /api/products/stats
// @access  Private/Admin
export const getProductStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const activeProducts = await Product.countDocuments({ status: 'active' });
        const totalInventory = await Product.aggregate([
            { $match: { trackInventory: true } },
            { $group: { _id: null, total: { $sum: '$inventory' } } }
        ]);
        const totalSold = await Product.aggregate([
            { $group: { _id: null, total: { $sum: '$totalSold' } } }
        ]);
        const totalRevenue = await Product.aggregate([
            { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$totalSold'] } } } }
        ]);
        const lowStockProducts = await Product.countDocuments({
            trackInventory: true,
            inventory: { $lt: 5, $gt: 0 },
            status: 'active'
        });
        const outOfStockProducts = await Product.countDocuments({
            trackInventory: true,
            inventory: 0,
            status: 'active'
        });
        
        res.json({
            success: true,
            data: {
                totalProducts,
                activeProducts,
                totalInventory: totalInventory[0]?.total || 0,
                totalSold: totalSold[0]?.total || 0,
                totalRevenue: totalRevenue[0]?.total || 0,
                lowStockProducts,
                outOfStockProducts
            }
        });
    } catch (error) {
        console.error('Error getting product stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get product statistics'
        });
    }
};

// @desc    Get categories with product counts
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        
        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        console.error('Error getting categories:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get categories'
        });
    }
};
