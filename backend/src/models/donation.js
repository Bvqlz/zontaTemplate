import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
    // Donor Information
    donorName: {
        type: String,
        required: true,
        trim: true
    },
    donorEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    donorPhone: {
        type: String,
        trim: true
    },
    
    // Donation Details
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    frequency: {
        type: String,
        enum: ['monthly', 'yearly', 'one-time'],
        default: 'one-time'
    },
    
    // Payment Information
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
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    
    // Additional Information
    message: {
        type: String,
        trim: true,
        maxlength: 250
    },
    receiptSent: {
        type: Boolean,
        default: false
    },
    
    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for faster queries
donationSchema.index({ status: 1, createdAt: -1 });
donationSchema.index({ donorEmail: 1 });

// TTL Index: Auto-delete failed/pending donations after 7 days
// This will automatically remove incomplete donation records
donationSchema.index(
    { createdAt: 1 }, 
    { 
        expireAfterSeconds: 604800, // 7 days in seconds (7 * 24 * 60 * 60)
        partialFilterExpression: { 
            status: { $in: ['failed', 'pending'] } 
        }
    }
);

// Virtual for formatted amount
// will return amount in dollars with 2 decimal places
donationSchema.virtual('formattedAmount').get(function() {
    return `$${this.amount.toFixed(2)}`;
});

// Method to mark as completed
// sets status to completed and records completedAt timestamp
donationSchema.methods.markCompleted = function() {
    this.status = 'completed';
    this.completedAt = new Date();
    return this.save();
};

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;

//remove purpose and custom purpose attributes