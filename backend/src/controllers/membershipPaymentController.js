import Stripe from 'stripe';
import Member from '../models/member.js';
import { sendMembershipApprovalEmail, sendMembershipRenewalReminder } from '../utils/emailService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const MEMBERSHIP_PRICES = {
    initial: 15000, // $150.00 in cents
    renewal: 14800  // $148.00 in cents
};

// Create checkout session for membership payment (called when admin approves)
export const createMembershipCheckout = async (req, res) => {
    try {
        const { memberId, isRenewal = false } = req.body;

        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({
                success: false,
                error: 'Member not found'
            });
        }

        // Determine payment type and amount
        const paymentType = isRenewal ? 'renewal' : 'initial';
        const amount = isRenewal ? MEMBERSHIP_PRICES.renewal : MEMBERSHIP_PRICES.initial;

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: isRenewal ? 'Zonta Club Membership Renewal' : 'Zonta Club Membership',
                        description: `${member.firstName} ${member.lastName} - ${isRenewal ? 'Annual Renewal' : 'Initial Membership'}`,
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            customer_email: member.email,
            client_reference_id: member._id.toString(),
            metadata: {
                memberId: member._id.toString(),
                memberEmail: member.email,
                memberName: `${member.firstName} ${member.lastName}`,
                paymentType: paymentType
            },
            payment_intent_data: {
                receipt_email: member.email,
            },
            success_url: `${process.env.FRONTEND_URL}/membership/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/membership/payment-cancelled`,
        });

        // Store pending session ID
        member.pendingStripeSessionId = session.id;
        await member.save();

        res.json({
            success: true,
            sessionId: session.id,
            url: session.url
        });

        console.log(`Membership checkout created for ${member.email} (${paymentType})`);
    } catch (error) {
        console.error('Error creating membership checkout:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create payment session'
        });
    }
};

// Handle Stripe webhook for membership payments
export const handleMembershipWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    // TEMPORARY: Skip signature verification for testing
    // TODO: Remove this and use proper verification in production
    try {
        event = JSON.parse(req.body.toString());
        console.log('⚠️ WARNING: Using webhook without signature verification (for testing only)');
    } catch (parseErr) {
        console.error('Failed to parse webhook body:', parseErr.message);
        return res.status(400).send(`Webhook Error: ${parseErr.message}`);
    }

    
    // Proper signature verification (commented out for testing)
    try {
        const webhookSecret = process.env.STRIPE_MEMBERSHIP_WEBHOOK_SECRET;
        
        if (webhookSecret) {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                webhookSecret
            );
        } else {
            console.warn('⚠️ STRIPE_MEMBERSHIP_WEBHOOK_SECRET not set');
            event = JSON.parse(req.body.toString());
        }
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }


    try {
        console.log(`📥 Membership webhook received: ${event.type}`);
        
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('✅ Payment completed for session:', session.id);
                console.log('📋 Metadata:', session.metadata);
                await handleSuccessfulPayment(session);
                break;
            }

            case 'checkout.session.expired': {
                const session = event.data.object;
                console.log('⏰ Payment session expired:', session.id);
                await handleExpiredSession(session);
                break;
            }

            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('❌ Error handling webhook:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
};

// Process successful payment
async function handleSuccessfulPayment(session) {
    console.log('🔄 Processing successful payment...');
    const { memberId, paymentType } = session.metadata;

    if (!memberId) {
        console.error('❌ No memberId in session metadata');
        return;
    }

    console.log(`🔍 Looking for member: ${memberId}`);
    const member = await Member.findById(memberId);
    if (!member) {
        console.error(`❌ Member not found: ${memberId}`);
        return;
    }

    console.log(`👤 Found member: ${member.email}`);

    const paymentDate = new Date();
    const renewalDate = new Date(paymentDate);
    renewalDate.setFullYear(renewalDate.getFullYear() + 1); // 1 year from now

    // Update member record
    member.membershipPaid = true;
    member.status = 'active';
    member.lastPaymentDate = paymentDate;
    member.lastPaymentAmount = session.amount_total / 100; // Convert from cents
    member.pendingStripeSessionId = null;
    member.renewalReminderSent = false;

    // Set membership dates
    if (paymentType === 'initial') {
        member.membershipStartDate = paymentDate;
    }
    member.membershipRenewalDate = renewalDate;

    // Add to payment history
    member.paymentHistory.push({
        amount: session.amount_total / 100,
        paymentDate: paymentDate,
        stripeSessionId: session.id,
        type: paymentType
    });

    await member.save();

    console.log(`✅ Membership payment successful for ${member.email} (${paymentType})`);
    console.log(`💰 Amount: $${session.amount_total / 100}`);
    console.log(`📅 Renewal date: ${renewalDate.toISOString()}`);
}

// Handle expired payment session
async function handleExpiredSession(session) {
    const { memberId } = session.metadata;

    const member = await Member.findById(memberId);
    if (member && member.pendingStripeSessionId === session.id) {
        member.pendingStripeSessionId = null;
        await member.save();
        console.log(`Payment session expired for ${member.email}`);
    }
}

// Get payment session details
export const getPaymentSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.json({
            success: true,
            data: {
                status: session.payment_status,
                customerEmail: session.customer_email,
                amountTotal: session.amount_total / 100
            }
        });
    } catch (error) {
        console.error('Error retrieving payment session:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve payment session'
        });
    }
};

// Check members for upcoming renewals (to be called by cron job)
export const checkMembershipRenewals = async () => {
    try {
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Find members whose renewal is in 7 days and haven't been reminded
        const membersToRemind = await Member.find({
            status: 'active',
            membershipPaid: true,
            renewalReminderSent: false,
            membershipRenewalDate: {
                $gte: tomorrow,
                $lte: oneWeekFromNow
            }
        });

        console.log(`Found ${membersToRemind.length} members needing renewal reminders`);

        for (const member of membersToRemind) {
            try {
                // Create checkout session for renewal
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: 'Zonta Club Membership Renewal',
                                description: `${member.firstName} ${member.lastName} - Annual Renewal`,
                            },
                            unit_amount: MEMBERSHIP_PRICES.renewal,
                        },
                        quantity: 1,
                    }],
                    mode: 'payment',
                    customer_email: member.email,
                    client_reference_id: member._id.toString(),
                    metadata: {
                        memberId: member._id.toString(),
                        memberEmail: member.email,
                        memberName: `${member.firstName} ${member.lastName}`,
                        paymentType: 'renewal'
                    },
                    success_url: `${process.env.FRONTEND_URL}/membership/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.FRONTEND_URL}/membership/payment-cancelled`,
                });

                // Send renewal reminder email with payment link
                await sendMembershipRenewalReminder(member, session.url);

                // Mark as reminded
                member.renewalReminderSent = true;
                member.pendingStripeSessionId = session.id;
                await member.save();

                console.log(`Renewal reminder sent to ${member.email}`);
            } catch (error) {
                console.error(`Error sending renewal reminder to ${member.email}:`, error);
            }
        }

        // Check for expired memberships
        const now = new Date();
        const expiredMembers = await Member.find({
            status: 'active',
            membershipRenewalDate: { $lt: now }
        });

        for (const member of expiredMembers) {
            member.status = 'expired';
            await member.save();
            console.log(`Membership expired for ${member.email}`);
        }

    } catch (error) {
        console.error('Error checking membership renewals:', error);
    }
};
