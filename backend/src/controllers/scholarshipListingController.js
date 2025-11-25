import ScholarshipListing from '../models/scholarshipListing.js';
import cloudinary from '../config/cloudinary.js';

// Get all scholarship listings (public - for display on scholarship page)
export const getAllScholarshipListings = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = {};
        if (status) {
            query.status = status;
        } else {
            // By default, only show active scholarships that haven't expired
            query.status = 'active';
            query.deadline = { $gte: new Date() };
        }

        const scholarships = await ScholarshipListing.find(query)
            .sort({ deadline: 1, createdAt: -1 });

        res.json({
            success: true,
            data: scholarships
        });
    } catch (error) {
        console.error('Error fetching scholarship listings:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch scholarship listings'
        });
    }
};

// Get single scholarship listing by ID or slug
export const getScholarshipListingById = async (req, res) => {
    try {
        const { identifier } = req.params;
        
        // Try to find by ID first, then by slug
        let scholarship = await ScholarshipListing.findById(identifier);
        if (!scholarship) {
            scholarship = await ScholarshipListing.findOne({ slug: identifier });
        }
        
        if (!scholarship) {
            return res.status(404).json({
                success: false,
                error: 'Scholarship not found'
            });
        }
        
        res.json({
            success: true,
            data: scholarship
        });
    } catch (error) {
        console.error('Error fetching scholarship listing:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch scholarship listing'
        });
    }
};

// Create new scholarship listing (Admin only)
export const createScholarshipListing = async (req, res) => {
    try {
        const scholarshipData = { ...req.body };
        
        // Handle image upload (required)
        if (req.files && req.files.image) {
            const imageFile = req.files.image[0];
            scholarshipData.image = {
                url: imageFile.path,
                publicId: imageFile.filename,
                alt: req.body.title || 'Scholarship image'
            };
        } else {
            return res.status(400).json({
                success: false,
                error: 'Scholarship image is required'
            });
        }

        // Handle optional attachment file (PDF, DOC, etc.)
        if (req.files && req.files.attachment) {
            const attachmentFile = req.files.attachment[0];
            scholarshipData.attachmentFile = {
                originalName: attachmentFile.originalname,
                filename: attachmentFile.filename,
                cloudinaryUrl: attachmentFile.path,
                cloudinaryPublicId: attachmentFile.filename,
                size: attachmentFile.size,
                mimetype: attachmentFile.mimetype
            };
        }
        
        const scholarship = await ScholarshipListing.create(scholarshipData);
        
        res.status(201).json({
            success: true,
            data: scholarship
        });
    } catch (error) {
        console.error('Error creating scholarship listing:', error);
        
        // Clean up uploaded files if scholarship creation fails
        if (req.files) {
            if (req.files.image) {
                try {
                    await cloudinary.uploader.destroy(req.files.image[0].filename);
                } catch (cleanupError) {
                    console.error('Error cleaning up image:', cleanupError);
                }
            }
            if (req.files.attachment) {
                try {
                    await cloudinary.uploader.destroy(req.files.attachment[0].filename, { resource_type: 'raw' });
                } catch (cleanupError) {
                    console.error('Error cleaning up attachment:', cleanupError);
                }
            }
        }
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'A scholarship with this slug already exists'
            });
        }
        
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to create scholarship listing'
        });
    }
};

// Update scholarship listing (Admin only)
export const updateScholarshipListing = async (req, res) => {
    try {
        const scholarshipData = { ...req.body };
        
        // Get existing scholarship
        const existingScholarship = await ScholarshipListing.findById(req.params.id);
        
        if (!existingScholarship) {
            return res.status(404).json({
                success: false,
                error: 'Scholarship not found'
            });
        }
        
        // Handle new image upload
        if (req.files && req.files.image) {
            // Delete old image from Cloudinary
            if (existingScholarship.image?.publicId) {
                try {
                    await cloudinary.uploader.destroy(existingScholarship.image.publicId);
                } catch (deleteError) {
                    console.error('Error deleting old image:', deleteError);
                }
            }
            
            const imageFile = req.files.image[0];
            scholarshipData.image = {
                url: imageFile.path,
                publicId: imageFile.filename,
                alt: req.body.title || existingScholarship.title
            };
        }

        // Handle new attachment file upload
        if (req.files && req.files.attachment) {
            // Delete old attachment from Cloudinary
            if (existingScholarship.attachmentFile?.cloudinaryPublicId) {
                try {
                    await cloudinary.uploader.destroy(existingScholarship.attachmentFile.cloudinaryPublicId, { resource_type: 'raw' });
                } catch (deleteError) {
                    console.error('Error deleting old attachment:', deleteError);
                }
            }
            
            const attachmentFile = req.files.attachment[0];
            scholarshipData.attachmentFile = {
                originalName: attachmentFile.originalname,
                filename: attachmentFile.filename,
                cloudinaryUrl: attachmentFile.path,
                cloudinaryPublicId: attachmentFile.filename,
                size: attachmentFile.size,
                mimetype: attachmentFile.mimetype
            };
        }
        
        const scholarship = await ScholarshipListing.findByIdAndUpdate(
            req.params.id,
            scholarshipData,
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            data: scholarship
        });
    } catch (error) {
        console.error('Error updating scholarship listing:', error);
        
        // Clean up newly uploaded files if update fails
        if (req.files) {
            if (req.files.image) {
                try {
                    await cloudinary.uploader.destroy(req.files.image[0].filename);
                } catch (cleanupError) {
                    console.error('Error cleaning up image:', cleanupError);
                }
            }
            if (req.files.attachment) {
                try {
                    await cloudinary.uploader.destroy(req.files.attachment[0].filename, { resource_type: 'raw' });
                } catch (cleanupError) {
                    console.error('Error cleaning up attachment:', cleanupError);
                }
            }
        }
        
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to update scholarship listing'
        });
    }
};

// Delete scholarship listing (Admin only)
export const deleteScholarshipListing = async (req, res) => {
    try {
        const scholarship = await ScholarshipListing.findById(req.params.id);
        
        if (!scholarship) {
            return res.status(404).json({
                success: false,
                error: 'Scholarship not found'
            });
        }
        
        // Delete image from Cloudinary
        if (scholarship.image?.publicId) {
            try {
                await cloudinary.uploader.destroy(scholarship.image.publicId);
            } catch (deleteError) {
                console.error('Error deleting image from Cloudinary:', deleteError);
            }
        }

        // Delete attachment from Cloudinary
        if (scholarship.attachmentFile?.cloudinaryPublicId) {
            try {
                await cloudinary.uploader.destroy(scholarship.attachmentFile.cloudinaryPublicId, { resource_type: 'raw' });
            } catch (deleteError) {
                console.error('Error deleting attachment from Cloudinary:', deleteError);
            }
        }
        
        await ScholarshipListing.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Scholarship listing deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting scholarship listing:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete scholarship listing'
        });
    }
};

// Get scholarship statistics (Admin only)
export const getScholarshipStats = async (req, res) => {
    try {
        const totalScholarships = await ScholarshipListing.countDocuments();
        const activeScholarships = await ScholarshipListing.countDocuments({ 
            status: 'active',
            deadline: { $gte: new Date() }
        });
        const expiredScholarships = await ScholarshipListing.countDocuments({
            $or: [
                { status: 'expired' },
                { deadline: { $lt: new Date() }, status: 'active' }
            ]
        });
        
        const totalAmount = await ScholarshipListing.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            success: true,
            data: {
                totalScholarships,
                activeScholarships,
                expiredScholarships,
                totalAmount: totalAmount[0]?.total || 0
            }
        });
    } catch (error) {
        console.error('Error getting scholarship stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get scholarship statistics'
        });
    }
};
