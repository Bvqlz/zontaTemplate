import Event from '../models/event.js';
import { EVENT_TYPES } from '../models/event.js';


export const getEvents = async (req, res, next) => {
    try {
        const { type, upcoming } = req.query;
        
        //a isActive means that the even is not cancelled or deleted
        //an attribute that is apart of the event schema
        const query = { isActive: true };

        //basically if the type given is one of the valid event types. This will be a dropdown so it should be fine
        if(type && Object.values(EVENT_TYPES).includes(type)) {
            query.type = type;
        }

        if(upcoming === 'true') {
            query.date = { $gte: new Date() }; // remember that $gte means greater than or equal to
        }

        //just remember that await means we are waiting for a promise to resolve where the promise was the database operation
        const events = await Event.find(query).sort({ date: 1 }).select('-__v'); //sort by date ascending and exclude __v field

        // respond with events when we presumably load the events page on the frontend
        res.json({
            success: true, 
            count: events.length,
            data: events
        });

        console.log(`${events.length} events retrieved`);

    } catch (error) {
        console.error('Error retrieving events:', error);
        next(error);
    }
};   


// this would be used when an admin wants to view details of a specific event to edit or delete
// honestly not needed because a user cannot click an event. Maybe this would be useful for like an RSVP feature
export const getEvent = async (req, res, next) => {
    try {
        //in the api route we defined :id as a route parameter
        const event = await Event.findById(req.params.id);

        // if we dont find the event
        if(!event) {
            return res.status(404).json({
                success: false,
                error: `Event not found`
            });
        }
        
        // respond with the event data. again to show it on the admin event management page
        res.json({
            success: true,
            data: event
        });

        console.log(`Event ${event.title} retrieved`);
    } catch(error) {
        // we are looking for a cast error because it indicates that the id format was invalid
        if(error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Event not found'
            });
        }
        console.error('Error retrieving event:', error);
        next(error);
    }
}

export const createNewEvent = async (req, res, next) => {
    try {
        // dont think an event should have an attribute for createdBy. will remove later
        const eventData = { ...req.body,
             createdBy: req.admin?.email || 'admin'
         };

         // once the response body has been validated we create the event in the database
         const event = await Event.create(eventData);

         // respond with the created event data
        res.status(201).json({
            success: true, 
            message: 'Event created successfully',
            data: event
        });

        console.log(`New event titled: ${event.title}`);
    } catch (error) {
        // we are looking for validation errors from mongoose
        if(error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                errors: errors
            });
        }
        console.error('Error creating event:', error);
        next(error); // gets sent to the global error handler in server.js
    }
}

export const updateExistingEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);

        // if we dont find the event
        if(!event) {
            return res.status(404).json({
                success: false,
                error: `Event not found`
            });
        }

        // we look at each key in the request body and update the event object accordingly
        Object.keys(req.body).forEach(key => {
            event[key] = req.body[key];
        });

        await event.save(); // we update this record in the database

        // respond with the updated event data
        res.json({
            success: true, 
            message: 'Event updated successfully',
            data: event
        });

        console.log(`Updated event: ${event.title}`);
    } catch (error) {
        if(error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                errors: errors
            });
        }

        console.error('Error updating event:', error);
        next(error);
    }
}

export const deleteExistingEvent = async (req, res, next) => {
    try {
        
        const event = await Event.findById(req.params.id);

        if(!event) {
            return res.status(404).json({
                success: false,
                error: `Event not found`
            });
        }

        // if we did encounter an error we proceed to delete the event
        await event.deleteOne();

        // do we need to save after deleteOne? - no we do not

        // return success message
        res.json({
            success: true,
            messsage: 'Event deleted successfully'
        });

        console.log(`Deleted event: ${event.title}`);
    } catch (error) {
        console.error('Error deleting event:', error);
        next(error);
    }
}

// deprecated test endpoint to verify event API is working
export const testEventEndpoint = (req, res) => {
    res.json({
        success: true,
        message: 'Event API is working',
        availableEventTypes: Object.values(EVENT_TYPES), 
        timestamp: new Date().toISOString()
    })
}