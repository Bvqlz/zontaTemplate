import Product from '../models/product.js';
import Order from '../models/order.js';
import Stripe from 'stripe';
import cloudinary from '../config/cloudinary.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// this gets the products for public view only showing active products
export const getAllProducts = async (req, res) => {
    try {
        const { category, status, search, sortBy = '-createdAt' } = req.query;
        
        const query = {};
        
        // For admin, show all products. For public, only active
        // req.user would equal a value of true if the request is authenticated as an admin user
        if (req.user) {
            if (status) query.status = status; 
        } else {
            query.status = 'active';
        }
        
        // builds the query object based on filters
        if (category) query.category = category;
        if (search) {
            query.$text = { $search: search };
        }
        
        const products = await Product.find(query)
            .sort(sortBy)
            .lean(); // lean does not create full mongoose documents

        // respond with the products data
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


// this would be used to get product details for public view
// we use this id in the checkout session creation
export const getProductById = async (req, res) => {
    try {

        const { identifier } = req.params; // the product's id
        
        // Try to find by ID first, then by slug
        // slug is a more human readable unique identifier i.g "zonta-face-mask"
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

// used in admin dashboard to create new products
export const createProduct = async (req, res) => {
    try {
        // Handle image upload if file is present
        const productData = { ...req.body };
        
        if (req.file) {
            // Add the uploaded image to the images array
            productData.images = [{
                url: req.file.path,
                publicId: req.file.filename,
                alt: req.body.name || 'Product image'
            }];
        }
        
        // based on the form an admin submits to create a new product we create the product
        const product = await Product.create(productData);
        
        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        
        // Clean up uploaded image if product creation fails
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (cleanupError) {
                console.error('Error cleaning up image:', cleanupError);
            }
        }
        
        // this error code indicates a duplicate key error, likely due to unique fields like SKU or slug
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

// if we want to update product details from admin dashboard
export const updateProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        
        // Handle new image upload
        if (req.file) {
            // Get existing product to delete old image
            const existingProduct = await Product.findById(req.params.id);
            
            if (existingProduct && existingProduct.images.length > 0) {
                // Delete old image from Cloudinary
                const oldImagePublicId = existingProduct.images[0].publicId;
                if (oldImagePublicId) {
                    try {
                        await cloudinary.uploader.destroy(oldImagePublicId);
                    } catch (deleteError) {
                        console.error('Error deleting old image:', deleteError);
                    }
                }
            }
            
            // Add new image
            productData.images = [{
                url: req.file.path,
                publicId: req.file.filename,
                alt: req.body.name || 'Product image'
            }];
        }
        
        // update the product based on the request body
        // new and runValidators ensure we get the updated document and validate the fields
        // no need for product.save() after findByIdAndUpdate
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            productData,
            {
                new: true,
                runValidators: true
            }
        );
        
        if (!product) {
            // Clean up uploaded image if product not found
            if (req.file) {
                try {
                    await cloudinary.uploader.destroy(req.file.filename);
                } catch (cleanupError) {
                    console.error('Error cleaning up image:', cleanupError);
                }
            }
            
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
        
        // Clean up uploaded image if update fails
        if (req.file) {
            try {
                await cloudinary.uploader.destroy(req.file.filename);
            } catch (cleanupError) {
                console.error('Error cleaning up image:', cleanupError);
            }
        }
        
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to update product'
        });
    }
};

// used in admin dashboard to delete a product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        // Delete associated images from Cloudinary
        if (product.images && product.images.length > 0) {
            for (const image of product.images) {
                if (image.publicId) {
                    try {
                        await cloudinary.uploader.destroy(image.publicId);
                    } catch (deleteError) {
                        console.error('Error deleting image from Cloudinary:', deleteError);
                    }
                }
            }
        }
        
        await Product.findByIdAndDelete(req.params.id);
        
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

// like the dontation checkout session we create a stripe checkout session for product purchase
export const createProductCheckout = async (req, res) => {
    try {
        // quantity defaults to 1 if not provided
        // but once again this is info a user would fill out in the frontend
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
        // meaning its status is active
        // status can disactivate for various reasons like out of stock or admin disabled
        if (!product.isAvailable()) {
            return res.status(400).json({
                success: false,
                error: 'Product is not available for purchase'
            });
        }
        
        // we check the inventory levels if we are tracking inventory and backorders are not allowed
        if (product.trackInventory && !product.allowBackorder && product.inventory < quantity) {
            return res.status(400).json({
                success: false,
                error: `Only ${product.inventory} items available in stock`
            });
        }

        // Create order record (status: pending)
        const order = await Order.create({
            customerName,
            customerEmail,
            productId: product._id,
            productName: product.name,
            quantity,
            pricePerUnit: product.price,
            totalAmount: product.price * quantity,
            status: 'pending'
        });
        
        // Create Stripe checkout session
        // success_url redirects to frontend success page after payment
        // cancel_url redirects back to shop page if user cancels
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
                            description: product.description || product.shortDescription || '',
                            images: product.images && product.images.length > 0 ? [product.images[0].url] : []
                        },
                        unit_amount: Math.round(product.price * 100) // Convert to cents
                    },
                    quantity: quantity
                }
            ],
            success_url: `${process.env.FRONTEND_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/shop?canceled=true&order_id=${order._id}`,
            metadata: {
                orderId: order._id.toString(),
                productId: product._id.toString(),
                productName: product.name,
                quantity: quantity.toString(),
                customerName
            }
        });

        // Update order with Stripe session ID
        order.stripeSessionId = session.id;
        await order.save();
        
        res.json({
            success: true,
            sessionId: session.id,
            url: session.url,
            orderId: order._id
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create checkout session'
        });
    }
};

// Stripe Webhook Handler for Product Purchases
export const handleProductWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature to ensure request is from Stripe
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the specific events we care about
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                
                // Find order by session ID and update status
                const order = await Order.findOne({ stripeSessionId: session.id });
                
                if (order) {
                    order.status = 'completed';
                    order.completedAt = new Date();
                    order.stripePaymentIntentId = session.payment_intent;
                    order.stripeCustomerId = session.customer;
                    await order.save();
                    
                    console.log(`Order ${order._id} marked as completed`);

                    // Decrease product inventory
                    const product = await Product.findById(order.productId);
                    if (product) {
                        await product.decreaseInventory(order.quantity);
                        console.log(`Inventory decreased for product: ${product.name}, Quantity: ${order.quantity}`);
                    }
                }
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                let failedOrder = await Order.findOne({ 
                    stripePaymentIntentId: failedPayment.id 
                });
                
                if (!failedOrder && failedPayment.metadata?.orderId) {
                    failedOrder = await Order.findById(failedPayment.metadata.orderId);
                }
                
                if (failedOrder) {
                    failedOrder.status = 'failed';
                    await failedOrder.save();
                    console.log(`Order ${failedOrder._id} marked as failed (payment failed)`);
                }
                break;

            case 'checkout.session.expired':
                const expiredSession = event.data.object;
                const expiredOrder = await Order.findOne({ 
                    stripeSessionId: expiredSession.id 
                });
                
                if (expiredOrder && expiredOrder.status === 'pending') {
                    expiredOrder.status = 'failed';
                    await expiredOrder.save();
                    console.log(`Order ${expiredOrder._id} marked as failed (session expired)`);
                }
                break;
            
            case 'checkout.session.async_payment_failed':
                const asyncFailedSession = event.data.object;
                const asyncFailedOrder = await Order.findOne({ 
                    stripeSessionId: asyncFailedSession.id 
                });
                
                if (asyncFailedOrder) {
                    asyncFailedOrder.status = 'failed';
                    await asyncFailedOrder.save();
                    console.log(`Order ${asyncFailedOrder._id} marked as failed (async payment failed)`);
                }
                break;

            // Ignore other Stripe events
            default:
                break;
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
};

// Get order by session ID (for success page)
export const getOrderBySessionId = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const order = await Order.findOne({ stripeSessionId: sessionId })
            .populate('productId', 'name description images');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order details'
        });
    }
};

// Cancel/mark order as failed when user cancels checkout
export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ 
                success: false,
                error: 'Order not found' 
            });
        }

        // Only cancel if it's still pending
        if (order.status === 'pending') {
            order.status = 'failed';
            await order.save();
            console.log(`Order ${order._id} marked as failed (user canceled checkout)`);
        }

        res.json({ 
            success: true,
            message: 'Order canceled',
            order 
        });
    } catch (error) {
        console.error('Error canceling order:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to cancel order' 
        });
    }
};

// gets the stats for product performance
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

// this gets the categories with product counts i.g "Apparel (1)"
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

// Get all orders with filtering
export const getAllOrders = async (req, res) => {
    try {
        const { status, startDate, endDate, page = 1, limit = 50 } = req.query;
        
        const query = {};
        
        if (status) query.status = status;
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const orders = await Order.find(query)
            .populate('productId', 'name images')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);
        
        const total = await Order.countDocuments(query);
        
        res.json({
            success: true,
            orders,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
    try {
        // Get all orders count
        const totalCount = await Order.countDocuments();
        
        // Total completed orders stats
        const totalStats = await Order.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$totalAmount' },
                    count: { $sum: 1 },
                    averageAmount: { $avg: '$totalAmount' }
                }
            }
        ]);

        // Last 30 days stats
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const last30DaysStats = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Status breakdown
        const statusBreakdown = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusObj = statusBreakdown.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        const stats = totalStats[0] || { totalAmount: 0, count: 0, averageAmount: 0 };
        const recent = last30DaysStats[0] || { totalAmount: 0, count: 0 };

        res.json({
            totalCount: totalCount,
            totalRevenue: stats.totalAmount,
            averageOrder: stats.averageAmount,
            completedCount: stats.count,
            last30Days: {
                totalAmount: recent.totalAmount,
                count: recent.count
            },
            statusBreakdown: {
                completed: statusObj.completed || 0,
                pending: statusObj.pending || 0,
                failed: statusObj.failed || 0
            }
        });
    } catch (error) {
        console.error('Error getting order stats:', error);
        res.status(500).json({
            error: 'Failed to get order statistics'
        });
    }
};

// Export orders to CSV
export const exportOrders = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        
        const query = {};
        
        if (status) query.status = status;
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        
        const orders = await Order.find(query)
            .populate('productId', 'name')
            .sort({ createdAt: -1 });
        
        // Create CSV
        const csvRows = [];
        csvRows.push(['Date', 'Customer Name', 'Email', 'Product', 'Quantity', 'Price Per Unit', 'Total Amount', 'Status'].join(','));
        
        orders.forEach(order => {
            const row = [
                new Date(order.createdAt).toLocaleString(),
                order.customerName,
                order.customerEmail,
                order.productName,
                order.quantity,
                order.pricePerUnit.toFixed(2),
                order.totalAmount.toFixed(2),
                order.status
            ];
            csvRows.push(row.join(','));
        });
        
        const csv = csvRows.join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error exporting orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to export orders'
        });
    }
};
