import cron from 'node-cron';
import { checkMembershipRenewals } from '../controllers/membershipPaymentController.js';
import Event from '../models/event.js';
import { sendEventReminder } from './emailService.js';

// Run membership renewal check daily at 9 AM
// Format: minute hour day-of-month month day-of-week
export const startMembershipRenewalScheduler = () => {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        console.log('Running membership renewal check...');
        try {
            await checkMembershipRenewals();
            console.log('Membership renewal check completed');
        } catch (error) {
            console.error('Error in membership renewal check:', error);
        }
    }, {
        timezone: "America/New_York" // Adjust to your timezone
    });

    console.log('Membership renewal scheduler started (runs daily at 9 AM)');
};

// Run event reminder check daily at 8 AM
export const startEventReminderScheduler = () => {
    // Run every day at 8:00 AM
    cron.schedule('0 8 * * *', async () => {
        console.log('🔔 Running event reminder check...');
        try {
            await checkAndSendEventReminders();
            console.log('✅ Event reminder check completed');
        } catch (error) {
            console.error('❌ Error in event reminder check:', error);
        }
    }, {
        timezone: "America/New_York" // Adjust to your timezone
    });

    console.log('📅 Event reminder scheduler started (runs daily at 8 AM)');
};

// Check for events happening in 24 hours and send reminders
export const checkAndSendEventReminders = async () => {
    try {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Set time range for "tomorrow" (24 hours from now, +/- 1 hour for flexibility)
        const tomorrowStart = new Date(tomorrow);
        tomorrowStart.setHours(0, 0, 0, 0);
        
        const tomorrowEnd = new Date(tomorrow);
        tomorrowEnd.setHours(23, 59, 59, 999);

        // Find active events happening tomorrow with RSVPs
        const upcomingEvents = await Event.find({
            status: 'active',
            date: {
                $gte: tomorrowStart,
                $lte: tomorrowEnd
            },
            'rsvps.0': { $exists: true } // Has at least one RSVP
        });

        console.log(`📋 Found ${upcomingEvents.length} event(s) happening tomorrow`);

        let totalRemindersSent = 0;
        let totalErrors = 0;

        for (const event of upcomingEvents) {
            console.log(`📧 Processing reminders for: ${event.title}`);
            
            // Send reminder to each attendee who hasn't received one yet
            for (const rsvp of event.rsvps) {
                if (!rsvp.reminderSent) {
                    try {
                        await sendEventReminder(event, rsvp.email);
                        
                        // Mark reminder as sent
                        rsvp.reminderSent = true;
                        totalRemindersSent++;
                        
                        console.log(`   ✓ Reminder sent to ${rsvp.email}`);
                    } catch (emailError) {
                        console.error(`   ✗ Failed to send reminder to ${rsvp.email}:`, emailError.message);
                        totalErrors++;
                    }
                }
            }
            
            // Save the event with updated reminderSent flags
            await event.save();
        }

        console.log(`📊 Event reminder summary: ${totalRemindersSent} sent, ${totalErrors} failed`);
        
        return {
            eventsProcessed: upcomingEvents.length,
            remindersSent: totalRemindersSent,
            errors: totalErrors
        };
    } catch (error) {
        console.error('Error checking event reminders:', error);
        throw error;
    }
};

// Optional: Run renewal check immediately on startup (useful for testing)
export const runImmediateRenewalCheck = async () => {
    console.log('Running immediate membership renewal check...');
    try {
        await checkMembershipRenewals();
        console.log('Immediate renewal check completed');
    } catch (error) {
        console.error('Error in immediate renewal check:', error);
    }
};
