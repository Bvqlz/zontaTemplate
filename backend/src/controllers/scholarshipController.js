import { sendScholarshipApplicationEmail } from '../utils/emailService.js';
import Scholarship from '../models/scholarship.js';
import cloudinary from '../config/cloudinary.js';

export const submitScholarshipApplication = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone } = req.body;

        // uploaded files are accessed
        const files = req.files || [];

        if (files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one file (transcript or recommendation letter) must be uploaded.'
            });
        }

        const existingApp = await Scholarship.findOne({ email: email.toLowerCase() });
        if (existingApp) {
            return res.status(400).json({
                success: false, 
                error: 'An application with this email already exists.'
            });
        }

        // Map Cloudinary file data
        const documents = files.map(file => ({
            originalName: file.originalname,
            filename: file.filename,
            cloudinaryUrl: file.path,
            cloudinaryPublicId: file.filename,
            size: file.size,
            mimetype: file.mimetype
        }));

        const scholarship = await Scholarship.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : null,
            documents: documents
        });

        const applicationData = {
            firstName: scholarship.firstName,
            lastName: scholarship.lastName,
            email: scholarship.email,
            phone: scholarship.phone
        };

        // Send email notification
        await sendScholarshipApplicationEmail(applicationData, files);

        res.status(201).json({
            success: true,
            message: 'Scholarship application submitted successfully.',
            data: {
                id: scholarship._id,
                applicantName: scholarship.fullName,
                applicantEmail: scholarship.email,
                documentsUploaded: files.length,
                submittedAt: scholarship.submittedAt
            }
        });

        console.log(`Scholarship application submitted: ${applicationData.email} (${files.length} files uploaded to Cloudinary)`);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);

            if(req.files) {
                for(const file of req.files) {
                    // remember that req.files is an array so we loop through each file and delete from cloudinary
                    await cloudinary.uploader.destroy(file.filename, { resource_type: 'raw' });
                }
            }

            return res.status(400).json({
                success: false,
                error: 'Validation Error',
                errors: errors
            });
        }

        console.error('Error submitting scholarship application:', error);
        next(error);
    }
};

export const getAllScholarships = async (req, res, next) => {
    try {
        const { status } = req.query;
        
        const query = {};
        if(status) {
            query.status = status;
        }

        const scholarships = await Scholarship.find(query).sort({ submittedAt: -1 }).select('-documents.path -__v');

        res.json({
            success: true,
            count: scholarships.length,
            data: scholarships
        });
    } catch (error) {
        console.error('Error fetching scholarships:', error);
        next(error);
    }
}

export const getScholarship = async (req, res, next) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id);

        if(!scholarship) {
            return res.status(404).json({
                success: false,
                error: 'Scholarship application not found'
            });
        }

        res.json({
            success: true,
            data: scholarship
        });
    } catch(error) {
        if(error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                error: 'Scholarship application not found'
            });
        }

        console.error('Error fetching scholarship application:', error);
        next(error);
    }
}

export const updateScholarship = async (req, res, next) => {
    try {
        const { status, notes } = req.body;
        const scholarship = await Scholarship.findById(req.params.id);

        if(!scholarship) {
            return res.status(404).json({
                success: false,
                error: 'Scholarship application not found'
            });
        }

        if(status) scholarship.status = status;
        if(notes !== undefined) scholarship.notes = notes;

        await scholarship.save();

        res.json({
            success: true,
            message: 'Scholarship application updated successfully',
            data: scholarship
        });

        console.log(`Scholarship application updated: ${scholarship.email} - Status: ${scholarship.status}`);
    } catch(error) {
        console.error('Error updating scholarship application: ', error);
        next(error);
    }
}

export const deleteScholarship = async (req, res, next) => {
    try {
        const scholarship = await Scholarship.findById(req.params.id);

        if(!scholarship) {
            return res.status(404).json({
                success: false,
                error: 'Scholarship application not found'
            });
        }

        for(const doc of scholarship.documents) {
            try {
                await cloudinary.uploader.destroy(doc.cloudinaryPublicId, { resource_type: 'raw' });
                console.log(`Deleted document from Cloudinary: ${doc.originalName}`);
            } catch(error) {
                console.error(`Error deleting document from Cloudinary: ${doc.originalName}`, error);
            }

        }

        await scholarship.deleteOne();

        res.json({
            success: true,
            message: 'Scholarship application deleted successfully'
        })

        console.log(`Scholarship application deleted: ${scholarship.email}`);
    } catch(error) {
        console.error('Error deleting scholarship application:', error);
        next(error);
    }
}



export const downloadScholarshipForm = (req, res) => {
    try {
        const filePath = path.join(__dirname, '../forms/test-form.pdf');

        //check if file exists
        if(!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false, 
                error: 'Form not found'
            });
        }

        res.download(filePath, 'zontaScholarship-Form.pdf', (err) => {
            if(err) {
                console.error('Error downloading form:', err);
                res.status(500).json({
                    success: false,
                    error: 'Error downloading form'
                });
            }
        });

        console.log('Scholarship form downloaded');
    } catch (error) {
        console.error('Error downloading scholarship form:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while downloading form'
        });
    }
}

export const testScholarshipEndpoint = (req, res) => {
    res.json({
        success: true,
        message: 'Scholarship API is working!',
        storage: 'Cloudinary',
        instructions: {
            step1: 'Download the scholarship application form',
            step2: 'Fill out the form completely',
            step3: 'Upload completed form along with transcripts and recommendation letters',
            step4: 'Provide your contact information'
        },
        uploadInfo: {
            maxFileSize: '5MB per file',
            maxFiles: 2,
            allowedTypes: ['PDF', 'DOC', 'DOCX'],
            requiredFields: ['firstName', 'lastName', 'email']
        },
        timestamp: new Date().toISOString()
    });
};