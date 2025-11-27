export const membershipApprovalEmailTemplate = (member, paymentUrl) => {
    const { firstName, lastName } = member;
    
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
                                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 0.5px;">
                                        🎉 Congratulations!
                                    </h1>
                                    <p style="color: #f0d4dc; margin: 15px 0 0 0; font-size: 16px; font-weight: 500;">
                                        Your membership has been approved
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="color: #333; font-size: 18px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Dear <strong>${firstName} ${lastName}</strong>,
                                    </p>
                                    
                                    <p style="color: #555; font-size: 16px; line-height: 1.7; margin: 0 0 25px 0;">
                                        We are thrilled to inform you that your application to join the <strong>Zonta Club of Naples</strong> has been <span style="color: #28a745; font-weight: 600;">approved</span>! We're excited to welcome you to our community of women leaders dedicated to advancing gender equality and empowering women worldwide.
                                    </p>

                                    <!-- Info Card -->
                                    <div style="background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%); border-left: 4px solid #28a745; padding: 25px; margin-bottom: 30px; border-radius: 8px;">
                                        <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                                            Next Step: Complete Your Membership
                                        </h3>
                                        <p style="color: #155724; font-size: 14px; line-height: 1.6; margin: 0;">
                                            To finalize your membership, please complete your payment of <strong style="font-size: 20px; color: #8B1538;">$150.00</strong>. This one-time fee covers your first year of membership.
                                        </p>
                                    </div>

                                    <!-- Payment Button -->
                                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 35px 0;">
                                        <tr>
                                            <td align="center">
                                                <a href="${paymentUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B1538 0%, #a01847 100%); color: #ffffff; text-decoration: none; padding: 18px 45px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(139, 21, 56, 0.3); transition: all 0.3s;">
                                                    Complete Payment - $150.00
                                                </a>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- What's Included -->
                                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin: 30px 0;">
                                        <h2 style="color: #8B1538; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">
                                            Your Membership Includes:
                                        </h2>
                                        <table cellpadding="8" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="vertical-align: top; width: 30px;">
                                                    <span style="color: #28a745; font-size: 20px; font-weight: bold;">✓</span>
                                                </td>
                                                <td>
                                                    <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.5;">
                                                        <strong>Networking Opportunities</strong> - Connect with like-minded women leaders
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 30px;">
                                                    <span style="color: #28a745; font-size: 20px; font-weight: bold;">✓</span>
                                                </td>
                                                <td>
                                                    <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.5;">
                                                        <strong>Community Service</strong> - Participate in impactful local projects
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 30px;">
                                                    <span style="color: #28a745; font-size: 20px; font-weight: bold;">✓</span>
                                                </td>
                                                <td>
                                                    <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.5;">
                                                        <strong>Professional Development</strong> - Access to workshops and training
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 30px;">
                                                    <span style="color: #28a745; font-size: 20px; font-weight: bold;">✓</span>
                                                </td>
                                                <td>
                                                    <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.5;">
                                                        <strong>Global Impact</strong> - Be part of Zonta International's mission
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="vertical-align: top; width: 30px;">
                                                    <span style="color: #28a745; font-size: 20px; font-weight: bold;">✓</span>
                                                </td>
                                                <td>
                                                    <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.5;">
                                                        <strong>Exclusive Events</strong> - Invitations to members-only gatherings
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Important Info -->
                                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 6px;">
                                        <p style="margin: 0; color: #856404; font-size: 13px; line-height: 1.6;">
                                            <strong>Important:</strong> Your payment link is valid for 24 hours. After completing payment, your membership will become active immediately, and your renewal date will be set for one year from your payment date.
                                        </p>
                                    </div>

                                    <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 25px 0 0 0;">
                                        If you have any questions about your membership or payment, please don't hesitate to reach out to us.
                                    </p>
                                    
                                    <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 20px 0 0 0;">
                                        We look forward to working alongside you!
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
                                        This is an automated message. Please do not reply to this email.
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
