import mongoose from "mongoose";

//enums
export const EVENT_TYPES = {
    FUNDARISER: 'fundraiser',
    MEETING: 'meeting',
    SOCIAL: 'social',
    SERVICE: 'service',
    OTHER: 'other'
}


const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [15, 'Description must be at least 15 characters']
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    type: {
        type: String,
        enum: Object.values(EVENT_TYPES),
        default: EVENT_TYPES.OTHER
    },
    ticketPrice: {
        type: Number,
        min: [0, 'Ticket price cannot be negative'],
        default: null
    },
    maxAttendees: {
        type: Number,
        min: [1, 'Max attendees must be at least 1'],
        default: null
    },
    imageUrl: {
        type: String,
        default: null
    },
    image: {
        url: {
            type: String
        },
        publicId: {
            type: String
        },
        alt: {
            type: String,
            default: ''
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['active', 'draft', 'archived'],
        default: 'draft'
    },
    rsvps: [{
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        rsvpDate: {
            type: Date,
            default: Date.now
        },
        reminderSent: {
            type: Boolean,
            default: false
        }
    }]
}, { timestamps: true });

eventSchema.index({ data: 1 }); //ascending order
eventSchema.index({ type: 1 }); //ascending order
eventSchema.index({ isActive: 1 }); //ascending order
eventSchema.index({ status: 1 }); //ascending order

eventSchema.virtual('isUpcoming').get(function() {
    return this.date > new Date();
})

//maybe if an event is past. it can be deleted from database records. 
eventSchema.virtual('isPast').get(function() {
    return this.date <= new Date();
})

//what this does is that when we convert a mongoose document to JSON or Object, it will include the virtuals we defined above
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Pre-find middleware to automatically archive past active events
// This runs before any find query and updates past events
eventSchema.pre(/^find/, async function(next) {
    const now = new Date();
    
    // Archive past active events
    await this.model.updateMany(
        {
            date: { $lt: now },
            status: 'active'
        },
        {
            $set: { status: 'archived' }
        }
    );
    
    next();
});

//basically saying that we want to find data that is today or in the future and has active status
eventSchema.statics.getUpcoming = function() {
    return this.find({
        date: { $gte: new Date() },
        status: 'active'
    }).sort({ date: 1 })
};

//finds past events with active status and sorts by descending order
eventSchema.statics.getPast = function() {
    return this.find({ 
        date: { $lt: new Date() },
        status: 'active'
    }).sort({ date: -1 });
};

// Static method to get all active events
eventSchema.statics.getActive = function() {
    return this.find({ status: 'active' }).sort({ date: 1 });
};

const Event = mongoose.model('Event', eventSchema);

export default Event;