import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    // Basic Product Information
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    shortDescription: {
        type: String,
        trim: true,
        maxlength: [500, 'Short description cannot exceed 500 characters']
    },
    
    // Pricing
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    compareAtPrice: {
        type: Number,
        min: [0, 'Compare price cannot be negative']
    },
    
    // Inventory
    inventory: {
        type: Number,
        required: true,
        default: 0,
        min: [0, 'Inventory cannot be negative']
    },
    trackInventory: {
        type: Boolean,
        default: true
    },
    allowBackorder: {
        type: Boolean,
        default: false
    },
    sku: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },
    
    // Categorization
    category: {
        type: String,
        required: true,
        enum: ['Apparel', 'Accessories', 'Books', 'Home & Garden', 'Jewelry', 'Art', 'Other'],
        default: 'Other'
    },
    tags: [{
        type: String,
        trim: true
    }],
    
    // Images
    images: [{
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String
        },
        alt: {
            type: String,
            default: ''
        }
    }],
    featuredImage: {
        type: String
    },
    
    // Product Status
    status: {
        type: String,
        enum: ['active', 'draft', 'archived'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    },
    
    // Shipping
    weight: {
        type: Number,
        min: 0
    },
    weightUnit: {
        type: String,
        enum: ['lb', 'oz', 'kg', 'g'],
        default: 'lb'
    },
    requiresShipping: {
        type: Boolean,
        default: true
    },
    
    // SEO
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    metaTitle: {
        type: String,
        maxlength: 60
    },
    metaDescription: {
        type: String,
        maxlength: 160
    },
    
    // Stats
    totalSold: {
        type: Number,
        default: 0,
        min: 0
    },
    views: {
        type: Number,
        default: 0,
        min: 0
    },
    
    // Stripe Integration
    stripePriceId: {
        type: String
    },
    stripeProductId: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ featured: 1, status: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Virtual for stock status
productSchema.virtual('inStock').get(function() {
    if (!this.trackInventory) return true;
    if (this.allowBackorder) return true;
    return this.inventory > 0;
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
    if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
});

// Generate slug from name
productSchema.pre('save', function(next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    // Set featured image to first image if not set
    if (this.images.length > 0 && !this.featuredImage) {
        this.featuredImage = this.images[0].url;
    }
    
    next();
});

// Method to check if available for purchase
productSchema.methods.isAvailable = function() {
    if (this.status !== 'active') return false;
    if (!this.trackInventory) return true;
    if (this.allowBackorder) return true;
    return this.inventory > 0;
};

// Method to decrease inventory after purchase
productSchema.methods.decreaseInventory = function(quantity = 1) {
    if (this.trackInventory) {
        this.inventory = Math.max(0, this.inventory - quantity);
        this.totalSold += quantity;
    }
    return this.save();
};

// Method to increase inventory (returns/restocks)
productSchema.methods.increaseInventory = function(quantity = 1) {
    if (this.trackInventory) {
        this.inventory += quantity;
    }
    return this.save();
};

// Static method to get active products
productSchema.statics.getActiveProducts = function() {
    return this.find({ status: 'active' }).sort({ createdAt: -1 });
};

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function() {
    return this.find({ status: 'active', featured: true }).sort({ createdAt: -1 });
};

const Product = mongoose.model('Product', productSchema);

export default Product;
