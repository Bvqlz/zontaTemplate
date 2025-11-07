import mongoose from 'mongoose';


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        minlength: [10, 'Message must be at least 10 characters']
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'responded'],
        default: 'unread'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, { timestamps: true });

// Indexes
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ submittedAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;

// status is an attribute that i dont think is necessary