import { sendMemberShipApplicationEmail } from "../utils/emailService.js";
import Member from '../models/Member.js';

export const submitMembershipApplication = async (req, res, next) => {
    try {
        
        //destructure the request body to get member application details which is filled out by the user on the membership application form in the frontend
        const { firstName, lastName, email, phone, reason } = req.body;

        //will probably change schema to have unique emails
        const existingMember = await Member.findOne({ email: email.toLowerCase() });
        if(existingMember) {
            return res.status(400).json({
                success: false,
                error: 'An application with this email already exists.'
            });
        }

        // create new member application record in the database
        const member = await Member.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            reason: reason.trim()
        });

        // prepare application data for email
        const applicationData = {
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            phone: member.phone,
            reason: member.reason
        };

        // send email notification to admin and applicant
        await sendMemberShipApplicationEmail(applicationData);

        //although ._id was not sent in the request, mongoose automatically creates it
        // we can include it in the response
        res.status(201).json({
            success: true,
            message: 'Thank you for your application! We will get back to you soon.',
            data: {
                id: member._id,
                applicantName: member.fullName,
                applicantEmail: member.email,
                submittedAt: member.submittedAt
            }
        });

        console.log('Membership application processed for:', member.email);

    } catch (error) {
        //for mongoose errors this grabs the schema validation messages and creates a array of them to show to the user
        if(error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message); //
            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                errors: errors
            });
        }

        console.error('Error processing membership application:', error);
        
        //next allows us to pass the error to the error handling middleware
        next(error);
    }
}

export const getAllMembers = async (req, res, next) => {
    try {

        const { status } = req.query; //can be for pending, approved or rejected members. for filtering

        const query = {};

        //helps build our query object 
        if(status) {
            query.status = status;
        }

        // newest members first are shown
        const members = await Member.find(query).sort({ submittedAt: -1 }).select('-__v'); //we don't need the __v field which is version key of mongoose documents

        // respond with the members data
        res.json({
            success: true,
            count: members.length,
            data: members
        });

    } catch (error) {
        console.error('Error fetching members:', error);
        next(error);
    }


}

//function is used in the admin dashboard to view individual member applications
export const getMember = async (req, res, next) => {
    try {

        const member = await Member.findById(req.params.id);

        if(!member) {
            return res.status(404).json({
                success: false,
                error: 'Member application was not found'
            });
        }

        res.json({
            success: true,
            data: member
        })
    } catch(error) {
        // a cast error occurs when the id format is invalid (not a valid ObjectId)
        // in other words, if someone tries to access /api/members/123 where 123 is not a valid ObjectId
        if(error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                error: 'Member application was not found'
            });
        }
    }
}

// used by admin to update member application status and notes
export const updateMember = async (req, res, next) => {
    try {
        const { status, notes } = req.body;
        const member = await Member.findById(req.params.id);

        if(!member) {
            return res.status(404).json({
                success: false,
                error: 'Member application was not found'
            });
        }
        
        //update fields by checking if they were provided in the request body
        //if they exist then we can assign them to the member object
        if(status) member.status = status;
        if(notes) member.notes = notes;

        await member.save(); // save the updated member record

        res.json({
            success: true,
            message: 'Member application updated successfully',
            data: member
        });

        console.log(`Member application updated: ${member.email} - Status: ${member.status}`);
    } catch (error) {
        console.error('Error updating member applications:', error);
        next(error);
    }
}

// would like to see if its possible to add a status of withdrawn that deletes this record from the db.
export const deleteMember = async (req, res, next) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);

        if(!member) {
            return res.status(404).json({
                success: false,
                error: 'Member application was not found'
            });
        }

        res.json({
            success: true,
            message: 'Member application deleted successfully'
        });

        console.log(`Member application deleted: ${member.email}`);
    } catch (error) {
        console.error('Error deleting member application:', error);
        next(error);
    }
}



//test endpoint that is not used 
export const testMemberEndpoint = (req, res) => {
    res.json({
        success: true,
        message: 'Member API is working',
        timestamp: new Date().toISOString()
    });
}




