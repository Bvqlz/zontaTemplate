export const membershipAdminEmailTemplate = (applicationData) => {
    const { firstName, lastName, email, phone, response } = applicationData;
    
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
                                <td style="background-color: #8B1538; padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">
                                        New Membership Application
                                    </h1>
                                    <p style="color: #f0d4dc; margin: 10px 0 0 0; font-size: 14px;">
                                        Zonta Club of Naples
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <!-- Alert Badge -->
                                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 16px; margin-bottom: 30px; border-radius: 4px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px;">
                                            <strong>Action Required:</strong> A new membership application requires your review.
                                        </p>
                                    </div>

                                    <!-- Applicant Information Card -->
                                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
                                        <h2 style="color: #8B1538; margin: 0 0 20px 0; font-size: 18px; font-weight: 600; border-bottom: 2px solid #8B1538; padding-bottom: 10px;">
                                            Applicant Information
                                        </h2>
                                        <table cellpadding="8" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #666; font-size: 14px; padding: 8px 0;">
                                                    <strong style="color: #333;">Full Name:</strong>
                                                </td>
                                                <td style="color: #333; font-size: 14px; padding: 8px 0;">
                                                    ${firstName} ${lastName}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666; font-size: 14px; padding: 8px 0;">
                                                    <strong style="color: #333;">Email:</strong>
                                                </td>
                                                <td style="color: #333; font-size: 14px; padding: 8px 0;">
                                                    <a href="mailto:${email}" style="color: #8B1538; text-decoration: none;">${email}</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #666; font-size: 14px; padding: 8px 0;">
                                                    <strong style="color: #333;">Phone:</strong>
                                                </td>
                                                <td style="color: #333; font-size: 14px; padding: 8px 0;">
                                                    ${phone || '<em style="color: #999;">Not provided</em>'}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Reason for Joining -->
                                    <div style="margin-bottom: 30px;">
                                        <h3 style="color: #8B1538; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                                            Reason for Joining:
                                        </h3>
                                        <div style="background-color: #fff9f0; border-left: 4px solid #8B1538; padding: 20px; border-radius: 4px; line-height: 1.6;">
                                            <p style="margin: 0; color: #333; font-size: 14px; white-space: pre-line;">
                                                ${response}
                                            </p>
                                        </div>
                                    </div>

                                    <!-- Action Button -->
                                    <div style="text-align: center; margin: 30px 0;">
                                        <a href="${process.env.VITE_API_URL || 'http://localhost:5173'}/admin/members" 
                                           style="background-color: #8B1538; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px rgba(139, 21, 56, 0.3);">
                                            View in Admin Dashboard →
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e9ecef;">
                                    <p style="margin: 0 0 8px 0; color: #6c757d; font-size: 12px; line-height: 1.5;">
                                        <strong>Submitted:</strong> ${new Date().toLocaleString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric', 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </p>
                                    <p style="margin: 0; color: #adb5bd; font-size: 11px;">
                                        This is an automated notification from the Zonta Club of Naples website.
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
