import Product from '../models/product.js';
import Stripe from 'stripe';
import cloudinary from '../config/cloudinary.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// this gets the products for public view only showing active products
export const getAllProducts = async (req, res) => {
    try {
        const { category, featured, status, search, sortBy = '-createdAt' } = req.query;
        
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
        if (featured === 'true') query.featured = true;
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
        
        // Increment views. going to remove this we do not need this functionality
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

// this feature as well is going to be removed. shop page is enough
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
            
            // Set featured image
            productData.featuredImage = req.file.path;
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
            
            productData.featuredImage = req.file.path;
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

// this handles stripe webhooks for product purchases
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
