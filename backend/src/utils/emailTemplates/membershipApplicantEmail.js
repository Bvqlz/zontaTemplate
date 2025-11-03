export const membershipApplicantEmailTemplate = (applicationData) => {
    const { firstName } = applicationData;
    
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
                                            Application Received!
                                        </h1>
                                        <p style="color: #f0d4dc; margin: 10px 0 0 0; font-size: 14px;">
                                            Zonta Club of Naples
                                        </p>
                                    </td>
                                </tr>                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Dear <strong>${firstName}</strong>,
                                    </p>
                                    
                                    <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 30px 0;">
                                        Thank you for your interest in joining the <strong>Zonta Club of Naples</strong>! We are thrilled that you want to be part of our mission to empower women through service and advocacy.
                                    </p>

                                    <!-- Success Badge -->
                                    <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 16px 20px; margin-bottom: 30px; border-radius: 4px;">
                                        <p style="margin: 0; color: #155724; font-size: 14px;">
                                            <strong>Confirmed:</strong> Your membership application has been successfully received and is now under review.
                                        </p>
                                    </div>

                                    <!-- Next Steps -->
                                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                        <h2 style="color: #8B1538; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                                            What Happens Next?
                                        </h2>
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 10px 0; vertical-align: top; width: 40px;">
                                                    <div style="background-color: #8B1538; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 600; font-size: 13px;">1</div>
                                                </td>
                                                <td style="padding: 10px 0; color: #555; font-size: 14px; line-height: 1.6;">
                                                    Our Membership Chair will carefully review your application
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; vertical-align: top;">
                                                    <div style="background-color: #8B1538; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 600; font-size: 13px;">2</div>
                                                </td>
                                                <td style="padding: 10px 0; color: #555; font-size: 14px; line-height: 1.6;">
                                                    We will contact you within <strong>3-5 business days</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; vertical-align: top;">
                                                    <div style="background-color: #8B1538; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; text-align: center; line-height: 28px; font-weight: 600; font-size: 13px;">3</div>
                                                </td>
                                                <td style="padding: 10px 0; color: #555; font-size: 14px; line-height: 1.6;">
                                                    You may be invited to attend one of our meetings or events
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Contact Info -->
                                    <div style="background-color: #fff9f0; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                                        <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                                            <strong>Questions?</strong>
                                        </p>
                                        <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                                            If you have any questions or would like to provide additional information, please feel free to reach out to us at 
                                            <a href="mailto:${process.env.EMAIL_FROM}" style="color: #8B1538; text-decoration: none; font-weight: 600;">${process.env.EMAIL_FROM}</a>
                                        </p>
                                    </div>

                                    <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 30px 0 0 0;">
                                        We look forward to welcoming you to our Zonta family!
                                    </p>
                                    
                                    <p style="color: #333; font-size: 15px; margin: 20px 0 0 0;">
                                        Warm regards,<br>
                                        <strong style="color: #8B1538;">The Zonta Club of Naples</strong>
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e9ecef; text-align: center;">
                                    <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 12px;">
                                        <strong>Empowering Women Through Service and Advocacy</strong>
                                    </p>
                                    <p style="margin: 0; color: #adb5bd; font-size: 11px;">
                                        This is an automated confirmation email. Please do not reply directly to this message.
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
