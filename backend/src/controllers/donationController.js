import Stripe from 'stripe';
import Donation from '../models/donation.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
    try {
        const { amount, donorName, donorEmail, donorPhone, purpose, customPurpose, message, isAnonymous, isRecurring, frequency } = req.body;

        // Validate required fields
        if (!amount || !donorName || !donorEmail || !purpose) {
            return res.status(400).json({ 
                error: 'Missing required fields: amount, donorName, donorEmail, purpose' 
            });
        }

        // Validate amount
        if (amount < 1) {
            return res.status(400).json({ error: 'Minimum donation amount is $1' });
        }

        // Create donation record in database (status: pending)
        const donation = await Donation.create({
            donorName,
            donorEmail,
            donorPhone,
            amount,
            purpose,
            customPurpose,
            message,
            isAnonymous,
            isRecurring: isRecurring || false,
            frequency: frequency || 'one-time',
            status: 'pending'
        });

        // Determine the purpose name for Stripe
        const purposeName = purpose === 'Other' && customPurpose ? customPurpose : purpose;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Donation - ${purposeName}`,
                            description: message || `Support Zonta Club of Naples - ${purposeName}`,
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/donate`,
            customer_email: donorEmail,
            metadata: {
                donationId: donation._id.toString(),
                purpose: purposeName,
                donorName
            },
            // Enable Stripe to send receipt
            payment_intent_data: {
                receipt_email: donorEmail,
            }
        });

        // Update donation with Stripe session ID
        donation.stripeSessionId = session.id;
        await donation.save();

        res.json({ 
            sessionId: session.id,
            url: session.url,
            donationId: donation._id
        });

    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ 
            error: 'Failed to create checkout session',
            details: error.message 
        });
    }
};

// Stripe Webhook Handler
export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                
                // Find donation by session ID
                const donation = await Donation.findOne({ stripeSessionId: session.id });
                
                if (donation) {
                    donation.status = 'completed';
                    donation.completedAt = new Date();
                    donation.stripePaymentIntentId = session.payment_intent;
                    donation.stripeCustomerId = session.customer;
                    await donation.save();
                    
                    console.log(`Donation ${donation._id} marked as completed`);
                }
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object;
                const failedDonation = await Donation.findOne({ 
                    stripePaymentIntentId: failedPayment.id 
                });
                
                if (failedDonation) {
                    failedDonation.status = 'failed';
                    await failedDonation.save();
                    console.log(`Donation ${failedDonation._id} marked as failed`);
                }
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
};

// Get all donations (Admin)
export const getAllDonations = async (req, res) => {
    try {
        const { status, purpose, startDate, endDate, page = 1, limit = 50 } = req.query;
        
        // Build query
        const query = {};
        
        if (status) {
            query.status = status;
        }
        
        if (purpose) {
            query.purpose = purpose;
        }
        
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Execute query with pagination
        const donations = await Donation.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Donation.countDocuments(query);

        // Calculate statistics
        const stats = await Donation.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    totalDonations: { $sum: 1 },
                    averageDonation: { $avg: '$amount' }
                }
            }
        ]);

        res.json({
            donations,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count,
            statistics: stats[0] || { totalAmount: 0, totalDonations: 0, averageDonation: 0 }
        });

    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ 
            error: 'Failed to fetch donations',
            details: error.message 
        });
    }
};

// Get single donation by ID
export const getDonationById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const donation = await Donation.findById(id);
        
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        res.json(donation);

    } catch (error) {
        console.error('Error fetching donation:', error);
        res.status(500).json({ 
            error: 'Failed to fetch donation',
            details: error.message 
        });
    }
};

// Get donation by session ID (for success page)
export const getDonationBySessionId = async (req, res) => {
    try {
        const { sessionId } = req.params;
        
        const donation = await Donation.findOne({ stripeSessionId: sessionId });
        
        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        res.json(donation);

    } catch (error) {
        console.error('Error fetching donation:', error);
        res.status(500).json({ 
            error: 'Failed to fetch donation',
            details: error.message 
        });
    }
};

// Get donation statistics
export const getDonationStats = async (req, res) => {
    try {
        // Total donations
        const totalStats = await Donation.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 },
                    averageAmount: { $avg: '$amount' }
                }
            }
        ]);

        // Donations by purpose
        const byPurpose = await Donation.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: '$purpose',
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { totalAmount: -1 } }
        ]);

        // Recent donations (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentStats = await Donation.aggregate([
            { 
                $match: { 
                    status: 'completed',
                    completedAt: { $gte: thirtyDaysAgo }
                } 
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            total: totalStats[0] || { totalAmount: 0, count: 0, averageAmount: 0 },
            byPurpose,
            last30Days: recentStats[0] || { totalAmount: 0, count: 0 }
        });

    } catch (error) {
        console.error('Error fetching donation stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch donation statistics',
            details: error.message 
        });
    }
};

// Export donations to CSV (Admin)
export const exportDonations = async (req, res) => {
    try {
        const { status, purpose, startDate, endDate } = req.query;
        
        const query = {};
        if (status) query.status = status;
        if (purpose) query.purpose = purpose;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const donations = await Donation.find(query).sort({ createdAt: -1 }).lean();

        // Create CSV content
        const csvHeader = 'Date,Donor Name,Email,Amount,Purpose,Status,Message\n';
        const csvRows = donations.map(d => {
            const date = new Date(d.createdAt).toLocaleDateString();
            const name = d.isAnonymous ? 'Anonymous' : d.donorName;
            const email = d.isAnonymous ? '' : d.donorEmail;
            const message = (d.message || '').replace(/,/g, ';').replace(/\n/g, ' ');
            return `${date},"${name}","${email}",${d.amount},"${d.purpose}",${d.status},"${message}"`;
        }).join('\n');

        const csv = csvHeader + csvRows;

        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename="donations-${Date.now()}.csv"`);
        res.send(csv);

    } catch (error) {
        console.error('Error exporting donations:', error);
        res.status(500).json({ 
            error: 'Failed to export donations',
            details: error.message 
        });
    }
};
