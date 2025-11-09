import Stripe from 'stripe';
import Donation from '../models/donation.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// uses the Stripe SDK to create a checkout session
export const createCheckoutSession = async (req, res) => {
    try {
        const { amount, donorName, donorEmail, donorPhone, message, isRecurring, frequency } = req.body;

        // Validate required fields
        if (!amount || !donorName || !donorEmail) {
            return res.status(400).json({ 
                error: 'Missing required fields: amount, donorName, donorEmail' 
            });
        }

        // Validate amount
        if (amount < 1) {
            return res.status(400).json({ error: 'Minimum donation amount is $1' });
        }

        // Create donation record in database (status: pending)
        // need to see how to update the donation status later via webhook
        // remove purpose, customPurpose, isAnonymous from donation schema

        // keep in mind that this record is created before the payment is completed
        // might have to do something where we delete donations that are never completed after a certain time period
        const donation = await Donation.create({
            donorName,
            donorEmail,
            donorPhone,
            amount,
            message,
            isRecurring: isRecurring || false,
            frequency: frequency || 'one-time',
            status: 'pending'
        });

        // Determine the purpose name for Stripe. we would just change this to be something like donation 

        // Create Stripe Checkout Session from stripes premade checkout flow
        // success_url will redirect to frontend with session id to fetch a donation status which will show a success page.
        // cancel_url will redirect back to the donate page if they cancel
        // what metadata is used for is to store extra info to identify the donation later in the webhook
        // stripe would handle the email receipt once payment is successful
        // we store the session id as a part of a donation record which is added to our table

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Donation`,
                            description: message || `Support Zonta Club of Naples`,
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/donate?canceled=true&donation_id=${donation._id}`,
            customer_email: donorEmail,
            metadata: {
                donationId: donation._id.toString(),
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
// Stripe Webhook Handler
// Stripe sends multiple events for each transaction (payment_intent.created, charge.succeeded, etc.)
// We only handle the events we care about for donation status tracking

export const handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        // Verify webhook signature to ensure request is from Stripe
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the specific events we care about
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                
                // Find donation by session ID and update status
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
                let failedDonation = await Donation.findOne({ 
                    stripePaymentIntentId: failedPayment.id 
                });
                
                if (!failedDonation && failedPayment.metadata?.donationId) {
                    failedDonation = await Donation.findById(failedPayment.metadata.donationId);
                }
                
                if (failedDonation) {
                    failedDonation.status = 'failed';
                    await failedDonation.save();
                    console.log(`Donation ${failedDonation._id} marked as failed (payment failed)`);
                }
                break;

            case 'checkout.session.expired':
                const expiredSession = event.data.object;
                const expiredDonation = await Donation.findOne({ 
                    stripeSessionId: expiredSession.id 
                });
                
                if (expiredDonation && expiredDonation.status === 'pending') {
                    expiredDonation.status = 'failed';
                    await expiredDonation.save();
                    console.log(`Donation ${expiredDonation._id} marked as failed (session expired)`);
                }
                break;
            
            case 'checkout.session.async_payment_failed':
                const asyncFailedSession = event.data.object;
                const asyncFailedDonation = await Donation.findOne({ 
                    stripeSessionId: asyncFailedSession.id 
                });
                
                if (asyncFailedDonation) {
                    asyncFailedDonation.status = 'failed';
                    await asyncFailedDonation.save();
                    console.log(`Donation ${asyncFailedDonation._id} marked as failed (async payment failed)`);
                }
                break;

            // Ignore other Stripe events (charge.succeeded, payment_intent.created, etc.)
            default:
                // Silently ignore unhandled events
                break;
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
};

// Cancel/mark donation as failed when user cancels checkout
export const cancelDonation = async (req, res) => {
    try {
        console.log('Cancel donation endpoint hit');
        const { donationId } = req.params;
        console.log('Donation ID:', donationId);

        const donation = await Donation.findById(donationId);
        console.log('Donation found:', donation ? `Yes (${donation._id})` : 'No');

        if (!donation) {
            console.log('Donation not found in database');
            return res.status(404).json({ error: 'Donation not found' });
        }

        console.log('Current donation status:', donation.status);

        // Only cancel if it's still pending
        if (donation.status === 'pending') {
            donation.status = 'failed';
            await donation.save();
            console.log(`Donation ${donation._id} marked as failed (user canceled checkout)`);
        } else {
            console.log(`Donation status is ${donation.status}, not updating`);
        }

        res.json({ 
            success: true,
            message: 'Donation canceled',
            donation 
        });
    } catch (error) {
        console.error('Error canceling donation:', error);
        res.status(500).json({ error: 'Failed to cancel donation' });
    }
};

// Get all donations call for admin with filtering, pagination, and statistics
export const getAllDonations = async (req, res) => {
    try {
        const { status, startDate, endDate, page = 1, limit = 50 } = req.query;
        
        // Build query
        const query = {};
        
        // all of these attributes build our query

        if (status) {
            query.status = status;
        }
        
        // this creates a date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Execute query with pagination (we just limit the results and skip based on page number)
        const donations = await Donation.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Donation.countDocuments(query); // total count for pagination

        // Calculate statistics
        // defaults status to completed donations only
        // this just looks through the entire table to find completed donations
        // this is the info used on the donation management page
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

        // returns the donations along with pagination info and statistics
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

// Get single donation by ID. we currently have no use for this
export const getDonationById = async (req, res) => {
    try {
        const { id } = req.params;
        
        //look at the schema for donation model to see what attributes are available
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
// why do we have two stats endpoints? one in the getAllDonations function and another here?
export const getDonationStats = async (req, res) => {
    try {
        // Get all donations count
        const totalCount = await Donation.countDocuments();
        
        // Total completed donations
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

        // Status breakdown
        const statusBreakdown = await Donation.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const statusObj = statusBreakdown.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        const stats = totalStats[0] || { totalAmount: 0, count: 0, averageAmount: 0 };
        const recent = recentStats[0] || { totalAmount: 0, count: 0 };

        res.json({
            totalCount: totalCount,
            totalAmount: stats.totalAmount,
            averageAmount: stats.averageAmount,
            completedCount: stats.count,
            last30Days: {
                totalAmount: recent.totalAmount,
                count: recent.count
            },
            statusBreakdown: {
                completed: statusObj.completed || 0,
                pending: statusObj.pending || 0,
                failed: statusObj.failed || 0
            }
        });

    } catch (error) {
        console.error('Error fetching donation stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch donation statistics',
            details: error.message 
        });
    }
};

// Clean up old pending/failed donations (Admin or scheduled task)
// This is a backup cleanup in case webhooks fail to update statuses
export const cleanupOldDonations = async (req, res) => {
    try {
        // Mark pending donations older than 24 hours as failed
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);
        
        const result = await Donation.updateMany(
            { 
                status: 'pending',
                createdAt: { $lt: oneDayAgo }
            },
            { 
                $set: { status: 'failed' }
            }
        );

        console.log(`Cleaned up ${result.modifiedCount} old pending donations`);

        res.json({
            success: true,
            message: `Updated ${result.modifiedCount} old pending donations to failed status`,
            count: result.modifiedCount
        });

    } catch (error) {
        console.error('Error cleaning up donations:', error);
        res.status(500).json({ 
            error: 'Failed to cleanup donations',
            details: error.message 
        });
    }
};

// Export donations to CSV (Admin)
export const exportDonations = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        
        const query = {};
        if (status) query.status = status;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const donations = await Donation.find(query).sort({ createdAt: -1 }).lean();

        // Create CSV content
        const csvHeader = 'Date,Donor Name,Email,Amount,Status,Message\n';
        const csvRows = donations.map(d => {
            const date = new Date(d.createdAt).toLocaleDateString();
            const name = d.donorName || 'Anonymous';
            const email = d.donorEmail || '';
            const message = (d.message || '').replace(/,/g, ';').replace(/\n/g, ' ');
            return `${date},"${name}","${email}",${d.amount},"${d.status}","${message}"`;
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


