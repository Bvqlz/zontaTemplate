export const eventReminderEmail = (event, attendeeEmail) => {
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = new Date(event.date).toDateString() === tomorrow.toDateString();

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Event Reminder</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                Event Reminder 🔔
            </h1>
            <p style="color: rgba(255, 255, 255, 0.95); margin: 10px 0 0 0; font-size: 18px; font-weight: 600;">
                ${isTomorrow ? 'Tomorrow!' : 'Coming Up Soon!'}
            </p>
        </div>

        <!-- Alert Badge -->
        <div style="text-align: center; margin: -30px 0 20px 0;">
            <div style="display: inline-block; background-color: #ffffff; padding: 15px 30px; border-radius: 50px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <span style="color: #D4AF37; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                    ⏰ ${isTomorrow ? '24 Hours Away' : 'Upcoming Event'}
                </span>
            </div>
        </div>

        <!-- Content -->
        <div style="padding: 20px 40px 40px 40px;">
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hi there,
            </p>

            <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                This is a friendly reminder that the event you registered for is ${isTomorrow ? '<strong>happening tomorrow</strong>' : 'coming up soon'}! We're looking forward to seeing you there.
            </p>

            <!-- Event Details Card with Urgency -->
            <div style="background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 3px solid #D4AF37; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);">
                <h2 style="color: #8B1538; margin: 0 0 20px 0; font-size: 22px;">
                    ${event.title}
                </h2>

                <div style="color: #555555; font-size: 15px; line-height: 1.8;">
                    <div style="margin-bottom: 15px; display: flex; align-items: start; background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37;">
                        <span style="color: #D4AF37; font-size: 24px; margin-right: 12px;">📅</span>
                        <div>
                            <strong style="color: #333333; font-size: 16px;">Date & Time</strong><br>
                            <span style="font-size: 16px; color: #8B1538; font-weight: 600;">${formattedDate}</span>
                        </div>
                    </div>

                    <div style="margin-bottom: 15px; display: flex; align-items: start; background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37;">
                        <span style="color: #D4AF37; font-size: 24px; margin-right: 12px;">📍</span>
                        <div>
                            <strong style="color: #333333; font-size: 16px;">Location</strong><br>
                            <span style="font-size: 15px; color: #555555;">${event.location}</span>
                        </div>
                    </div>

                    ${event.type ? `
                    <div style="display: flex; align-items: start; background-color: #ffffff; padding: 15px; border-radius: 8px; border-left: 4px solid #D4AF37;">
                        <span style="color: #D4AF37; font-size: 24px; margin-right: 12px;">🏷️</span>
                        <div>
                            <strong style="color: #333333; font-size: 16px;">Event Type</strong><br>
                            <span style="font-size: 15px; color: #555555;">${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>

            ${event.description ? `
            <!-- Event Description -->
            <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #8B1538; margin: 0 0 15px 0; font-size: 16px;">
                    What to Expect
                </h3>
                <p style="margin: 0; color: #555555; font-size: 14px; line-height: 1.6;">
                    ${event.description}
                </p>
            </div>
            ` : ''}

            <!-- Preparation Tips -->
            <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <div style="display: flex; align-items: start;">
                    <div style="color: #388e3c; font-size: 24px; margin-right: 15px;">💡</div>
                    <div>
                        <div style="color: #2e7d32; font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                            Things to Remember
                        </div>
                        <ul style="color: #555555; font-size: 13px; line-height: 1.7; margin: 8px 0; padding-left: 20px;">
                            <li>Plan to arrive a few minutes early</li>
                            <li>Bring any materials or items mentioned in the event description</li>
                            <li>Check the weather and dress accordingly</li>
                            <li>Save our contact information in case you need to reach us</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- CTA Buttons -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'https://www.zontaclubofnaples.org'}/events" 
                   style="display: inline-block; background: linear-gradient(135deg, #8B1538 0%, #6B1028 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(139, 21, 56, 0.3); margin: 5px;">
                    View Event Details
                </a>
            </div>

            <!-- Contact Info -->
            <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <div style="display: flex; align-items: start;">
                    <div style="color: #1976d2; font-size: 24px; margin-right: 15px;">📞</div>
                    <div>
                        <div style="color: #1565c0; font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                            Need Help or Have Questions?
                        </div>
                        <div style="color: #555555; font-size: 13px; line-height: 1.5;">
                            If you have any questions or need to make changes to your RSVP, please contact us at <a href="mailto:info@zontaclubofnaples.org" style="color: #1976d2; text-decoration: none;">info@zontaclubofnaples.org</a>
                        </div>
                    </div>
                </div>
            </div>

            <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 30px 0;">
                We can't wait to see you ${isTomorrow ? 'tomorrow' : 'at the event'}! Thank you for being part of our community.
            </p>

            <p style="color: #333333; font-size: 15px; line-height: 1.6;">
                See you soon,<br>
                <strong style="color: #8B1538;">The Zonta Club of Naples Team</strong>
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 30px 40px; border-top: 1px solid #e0e0e0;">
            <div style="text-align: center; margin-bottom: 20px;">
                <a href="${process.env.FRONTEND_URL || 'https://www.zontaclubofnaples.org'}/events" style="color: #8B1538; text-decoration: none; font-weight: 600; font-size: 14px; margin: 0 15px;">
                    View All Events
                </a>
                <span style="color: #dee2e6;">|</span>
                <a href="${process.env.FRONTEND_URL || 'https://www.zontaclubofnaples.org'}/contact" style="color: #8B1538; text-decoration: none; font-weight: 600; font-size: 14px; margin: 0 15px;">
                    Contact Us
                </a>
            </div>
            <p style="color: #999999; font-size: 12px; line-height: 1.5; text-align: center; margin: 0;">
                Zonta Club of Naples<br>
                Empowering Women Through Service and Advocacy<br>
                <a href="mailto:info@zontaclubofnaples.org" style="color: #8B1538; text-decoration: none;">info@zontaclubofnaples.org</a>
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();
};
