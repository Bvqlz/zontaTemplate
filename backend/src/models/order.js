import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    // Customer Information
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    
    // Product Information
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    
    // Order Status
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    
    // Stripe Information
    stripeSessionId: {
        type: String,
        unique: true,
        sparse: true
    },
    stripePaymentIntentId: {
        type: String
    },
    stripeCustomerId: {
        type: String
    },
    
    // Timestamps
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Indexes for faster queries
orderSchema.index({ customerEmail: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });


orderSchema.index(
    { createdAt: 1 }, 
    { 
        expireAfterSeconds: 604800, 
        partialFilterExpression: { 
            status: { $in: ['failed', 'pending'] } 
        }
    }

)

const Order = mongoose.model('Order', orderSchema);

export default Order;
