export const eventRsvpConfirmationEmail = (event, attendeeEmail) => {
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RSVP Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8B1538 0%, #6B1028 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                You're All Set! ✓
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">
                Your RSVP has been confirmed
            </p>
        </div>

        <!-- Success Badge -->
        <div style="text-align: center; margin: -30px 0 20px 0;">
            <div style="display: inline-block; background-color: #ffffff; padding: 15px 30px; border-radius: 50px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <span style="color: #4caf50; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                    ✓ Confirmed
                </span>
            </div>
        </div>

        <!-- Content -->
        <div style="padding: 20px 40px 40px 40px;">
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hi there,
            </p>

            <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                Thank you for registering! We're excited to have you join us at our upcoming event. Here are the details:
            </p>

            <!-- Event Details Card -->
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #8B1538;">
                <h2 style="color: #8B1538; margin: 0 0 20px 0; font-size: 22px;">
                    ${event.title}
                </h2>

                <div style="color: #555555; font-size: 15px; line-height: 1.8;">
                    <div style="margin-bottom: 15px; display: flex; align-items: start;">
                        <span style="color: #8B1538; font-size: 20px; margin-right: 12px;">📅</span>
                        <div>
                            <strong style="color: #333333;">Date & Time</strong><br>
                            ${formattedDate}
                        </div>
                    </div>

                    <div style="margin-bottom: 15px; display: flex; align-items: start;">
                        <span style="color: #8B1538; font-size: 20px; margin-right: 12px;">📍</span>
                        <div>
                            <strong style="color: #333333;">Location</strong><br>
                            ${event.location}
                        </div>
                    </div>

                    ${event.type ? `
                    <div style="margin-bottom: 15px; display: flex; align-items: start;">
                        <span style="color: #8B1538; font-size: 20px; margin-right: 12px;">🏷️</span>
                        <div>
                            <strong style="color: #333333;">Event Type</strong><br>
                            ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </div>
                    </div>
                    ` : ''}

                    ${event.description ? `
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                        <strong style="color: #333333; display: block; margin-bottom: 10px;">About This Event</strong>
                        <p style="margin: 0; color: #666666; line-height: 1.6;">
                            ${event.description.length > 300 ? event.description.substring(0, 300) + '...' : event.description}
                        </p>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Reminder Notice -->
            <div style="background-color: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <div style="display: flex; align-items: start;">
                    <div style="color: #1976d2; font-size: 24px; margin-right: 15px;">🔔</div>
                    <div>
                        <div style="color: #1565c0; font-size: 14px; font-weight: 600; margin-bottom: 8px;">
                            Event Reminder
                        </div>
                        <div style="color: #555555; font-size: 13px; line-height: 1.5;">
                            We'll send you a reminder email 24 hours before the event with all the details you need. Make sure to add this to your calendar!
                        </div>
                    </div>
                </div>
            </div>

            <!-- Add to Calendar CTA -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'https://www.zontaclubofnaples.org'}/events" 
                   style="display: inline-block; background: linear-gradient(135deg, #8B1538 0%, #6B1028 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(139, 21, 56, 0.3);">
                    View Event Details
                </a>
            </div>

            <p style="color: #555555; font-size: 15px; line-height: 1.6; margin: 30px 0;">
                Looking forward to seeing you there! If you have any questions, please don't hesitate to reach out.
            </p>

            <p style="color: #333333; font-size: 15px; line-height: 1.6;">
                Best regards,<br>
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
