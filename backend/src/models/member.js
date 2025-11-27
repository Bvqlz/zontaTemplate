import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'],
    },
    phone: {
        type: String,
        trim: true
    },
    reason: {
        type: String,
        required: [true, 'Reason for joining is required'],
        minlength: [20, 'Reason must be at least 20 characters'],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'active', 'expired'],
        default: 'pending'
    },
    // Payment tracking
    membershipPaid: {
        type: Boolean,
        default: false
    },
    membershipStartDate: {
        type: Date
    },
    membershipRenewalDate: {
        type: Date
    },
    lastPaymentDate: {
        type: Date
    },
    lastPaymentAmount: {
        type: Number
    },
    paymentHistory: [{
        amount: Number,
        paymentDate: Date,
        stripeSessionId: String,
        type: {
            type: String,
            enum: ['initial', 'renewal'],
            default: 'initial'
        }
    }],
    // Stripe session for pending payment
    pendingStripeSessionId: {
        type: String
    },
    renewalReminderSent: {
        type: Boolean,
        default: false
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, { timestamps: true });

//index1 
memberSchema.index({ email: 1 }); //ascending order
memberSchema.index({ status: 1 }); //ascending order
memberSchema.index({ submittedAt: -1 }); //descending order

memberSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

memberSchema.set('toJSON', {virtuals: true });
memberSchema.set('toObject', {virtuals: true });

const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);

export default Member;