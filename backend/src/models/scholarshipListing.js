import mongoose from 'mongoose';

// This model is for scholarship listings (what admins create)
// The existing scholarship.js model is for scholarship applications (what users submit)

const scholarshipListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Scholarship title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    shortDescription: {
        type: String,
        trim: true,
        maxlength: [300, 'Short description cannot exceed 300 characters']
    },
    amount: {
        type: Number,
        required: [true, 'Scholarship amount is required'],
        min: [0, 'Amount cannot be negative']
    },
    deadline: {
        type: Date,
        required: [true, 'Application deadline is required']
    },
    eligibility: {
        type: String,
        trim: true,
        maxlength: [1000, 'Eligibility criteria cannot exceed 1000 characters']
    },
    // Image for the scholarship card
    image: {
        url: {
            type: String,
            required: true
        },
        publicId: {
            type: String,
            required: true // Required for Cloudinary deletion
        },
        alt: {
            type: String,
            default: ''
        }
    },
    // Optional file attachment (PDF, DOC, etc.)
    attachmentFile: {
        originalName: String,
        filename: String,
        cloudinaryUrl: String,
        cloudinaryPublicId: String,
        size: Number,
        mimetype: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    // External link for "Learn More" button
    learnMoreUrl: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true; // Optional field
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL starting with http:// or https://'
        }
    },
    // Status
    status: {
        type: String,
        enum: ['active', 'draft', 'archived', 'expired'],
        default: 'draft'
    },
    // Slug for URL
    slug: {
        type: String,
        unique: true,
        sparse: true
    },
    // Featured scholarship
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true 
});

// Indexes
scholarshipListingSchema.index({ status: 1 });
scholarshipListingSchema.index({ deadline: 1 });

// Virtual to check if scholarship is still open
scholarshipListingSchema.virtual('isOpen').get(function() {
    return this.deadline > new Date() && this.status === 'active';
});

// Virtual to check if deadline has passed
scholarshipListingSchema.virtual('isExpired').get(function() {
    return this.deadline <= new Date();
});

// Static method to get active scholarships
scholarshipListingSchema.statics.getActive = function() {
    return this.find({
        status: 'active',
        deadline: { $gte: new Date() }
    }).sort({ deadline: 1 });
};

// Pre-save middleware to generate slug from title
scholarshipListingSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    
    // Auto-expire scholarships past deadline
    if (this.deadline <= new Date() && this.status === 'active') {
        this.status = 'expired';
    }
    
    next();
});

scholarshipListingSchema.set('toJSON', { virtuals: true });
scholarshipListingSchema.set('toObject', { virtuals: true });

const ScholarshipListing = mongoose.model('ScholarshipListing', scholarshipListingSchema);

export default ScholarshipListing;
