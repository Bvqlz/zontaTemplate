import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema({
    scholarshipListingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScholarshipListing',
        required: [true, 'Scholarship listing reference is required'],
        index: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        trim: true
    },
    documents: [{
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
    }],
    status: {
        type: String,
        enum: ['pending', 'under_review', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, {  timestamps: true });

scholarshipSchema.index({ email: 1 });
scholarshipSchema.index({ status: 1 });
scholarshipSchema.index({ submittedAt: -1 });

scholarshipSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

scholarshipSchema.virtual('documentCount').get(function() {
    return this.documents.length;
});

scholarshipSchema.set('toJSON', { virtuals: true });
scholarshipSchema.set('toObject', { virtuals: true });

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

export default Scholarship;

//since we are going to have multiple scholarhips, an attribute for scholarship type