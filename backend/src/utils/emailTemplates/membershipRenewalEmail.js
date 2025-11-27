export const membershipRenewalReminderTemplate = (member, paymentUrl) => {
    const { firstName, lastName, membershipRenewalDate } = member;
    const renewalDateFormatted = new Date(membershipRenewalDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #8B1538 0%, #a01847 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">
                                        Membership Renewal Reminder
                                    </h1>
                                    <p style="color: #f0d4dc; margin: 15px 0 0 0; font-size: 15px;">
                                        Zonta Club of Naples
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="color: #333; font-size: 17px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Dear <strong>${firstName} ${lastName}</strong>,
                                    </p>
                                    
                                    <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 25px 0;">
                                        Your <strong>Zonta Club of Naples</strong> membership is coming up for renewal! We've loved having you as part of our community, and we hope you'll continue your journey with us.
                                    </p>

                                    <!-- Renewal Info Card -->
                                    <div style="background: linear-gradient(135deg, #fff3cd 0%, #fffbea 100%); border-left: 4px solid #ffc107; padding: 25px; margin-bottom: 30px; border-radius: 8px;">
                                        <h3 style="color: #856404; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                                            Renewal Details
                                        </h3>
                                        <table cellpadding="5" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #856404; font-size: 14px; padding: 4px 0;">
                                                    <strong>Renewal Date:</strong>
                                                </td>
                                                <td style="color: #856404; font-size: 14px; padding: 4px 0;">
                                                    ${renewalDateFormatted}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #856404; font-size: 14px; padding: 4px 0;">
                                                    <strong>Renewal Fee:</strong>
                                                </td>
                                                <td style="color: #856404; font-size: 14px; padding: 4px 0;">
                                                    <span style="font-size: 18px; font-weight: 700; color: #8B1538;">$148.00</span>
                                                    <span style="font-size: 12px; color: #666; text-decoration: line-through; margin-left: 8px;">$150.00</span>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="color: #856404; font-size: 13px; margin: 15px 0 0 0; line-height: 1.5;">
                                            <strong>💰 Save $2!</strong> As a returning member, you receive a $2 discount on your renewal fee.
                                        </p>
                                    </div>

                                    <!-- Payment Button -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 35px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="${paymentUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B1538 0%, #a01847 100%); color: #ffffff; text-decoration: none; padding: 18px 45px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(139, 21, 56, 0.3);">
                                                    Renew Membership - $148.00
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Year in Review -->
                                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 30px 0;">
                                        <h2 style="color: #8B1538; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                                            Thank You for an Amazing Year!
                                        </h2>
                                        <p style="color: #555; font-size: 14px; line-height: 1.7; margin: 0;">
                                            Your membership has helped us make a real difference in our community. Together, we've supported education initiatives, empowered women, and created lasting change. We're grateful for your commitment and look forward to achieving even more together in the coming year.
                                        </p>
                                    </div>

                                    <!-- What to Expect -->
                                    <div style="border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                        <h3 style="color: #333; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                                            Coming Up This Year:
                                        </h3>
                                        <table cellpadding="6" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="vertical-align: top; width: 25px;">
                                                    <span style="color: #8B1538; font-size: 16px;">•</span>
                                                </td>
                                                <td>
                                                    <p style="margin: 0; color: #555; font-size: 13px;">
                                                        New scholarship programs and increased funding
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top;">
                                                    <span style="color: #8B1538; font-size: 16px;">•</span>
                                                </td>
                                                <td>
                                                    <p style="margin: 0; color: #555; font-size: 13px;">
                                                        Exciting networking events and workshops
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top;">
                                                    <span style="color: #8B1538; font-size: 16px;">•</span>
                                                </td>
                                                <td>
                                                    <p style="margin: 0; color: #555; font-size: 13px;">
                                                        Community outreach and service projects
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top;">
                                                    <span style="color: #8B1538; font-size: 16px;">•</span>
                                                </td>
                                                <td>
                                                    <p style="margin: 0; color: #555; font-size: 13px;">
                                                        Leadership development opportunities
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Important Notice -->
                                    <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 20px; margin: 25px 0; border-radius: 6px;">
                                        <p style="margin: 0; color: #721c24; font-size: 13px; line-height: 1.6;">
                                            <strong>⚠️ Action Required:</strong> Please complete your renewal payment by <strong>${renewalDateFormatted}</strong> to maintain your active membership status and continue enjoying all member benefits.
                                        </p>
                                    </div>

                                    <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 25px 0 0 0;">
                                        If you have any questions or concerns about your renewal, please don't hesitate to contact us.
                                    </p>
                                    
                                    <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 20px 0 0 0;">
                                        Thank you for being a valued member!
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                    <p style="color: #8B1538; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">
                                        Zonta Club of Naples
                                    </p>
                                    <p style="color: #666; margin: 0; font-size: 13px; line-height: 1.5;">
                                        Empowering Women Through Service and Advocacy
                                    </p>
                                    <p style="color: #999; margin: 15px 0 0 0; font-size: 12px;">
                                        This is an automated reminder. Please do not reply to this email.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
};
