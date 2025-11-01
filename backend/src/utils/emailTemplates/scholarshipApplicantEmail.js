export const scholarshipApplicantEmailTemplate = (applicationData, files = []) => {
    const { firstName, lastName, email } = applicationData;
    
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
                                        Scholarship Program - Zonta Club of Naples
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Dear <strong>${firstName}</strong>,
                                    </p>
                                    
                                    <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 30px 0;">
                                        Thank you for applying for the <strong>Zonta Club of Naples Scholarship</strong>! We have successfully received your application and all supporting documents. Your ambition and dedication to education inspire us.
                                    </p>

                                    <!-- Confirmation Card -->
                                    <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                                        <h3 style="color: #155724; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                                            Submission Confirmed
                                        </h3>
                                        <table cellpadding="5" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="color: #155724; font-size: 13px; padding: 4px 0;">
                                                    <strong>Applicant:</strong>
                                                </td>
                                                <td style="color: #155724; font-size: 13px; padding: 4px 0;">
                                                    ${firstName} ${lastName}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #155724; font-size: 13px; padding: 4px 0;">
                                                    <strong>Email:</strong>
                                                </td>
                                                <td style="color: #155724; font-size: 13px; padding: 4px 0;">
                                                    ${email}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #155724; font-size: 13px; padding: 4px 0;">
                                                    <strong>Documents:</strong>
                                                </td>
                                                <td style="color: #155724; font-size: 13px; padding: 4px 0;">
                                                    ${files.length} file(s) uploaded
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color: #155724; font-size: 13px; padding: 4px 0;">
                                                    <strong>Submitted:</strong>
                                                </td>
                                                <td style="color: #155724; font-size: 13px; padding: 4px 0;">
                                                    ${new Date().toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Timeline -->
                                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 30px;">
                                        <h2 style="color: #8B1538; margin: 0 0 20px 0; font-size: 18px; font-weight: 600;">
                                            What Happens Next?
                                        </h2>
                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                            <tr>
                                                <td style="padding: 12px 0; vertical-align: top; width: 40px;">
                                                    <div style="background-color: #8B1538; color: #ffffff; width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">1</div>
                                                </td>
                                                <td style="padding: 12px 0 12px 10px;">
                                                    <p style="margin: 0; color: #333; font-size: 14px; font-weight: 600;">Application Review</p>
                                                    <p style="margin: 5px 0 0 0; color: #666; font-size: 13px; line-height: 1.5;">
                                                        Our scholarship committee will carefully review your application and documents
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0; vertical-align: top;">
                                                    <div style="background-color: #8B1538; color: #ffffff; width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">2</div>
                                                </td>
                                                <td style="padding: 12px 0 12px 10px;">
                                                    <p style="margin: 0; color: #333; font-size: 14px; font-weight: 600;">Review Period</p>
                                                    <p style="margin: 5px 0 0 0; color: #666; font-size: 13px; line-height: 1.5;">
                                                        The review process typically takes <strong>2-4 weeks</strong>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0; vertical-align: top;">
                                                    <div style="background-color: #8B1538; color: #ffffff; width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">3</div>
                                                </td>
                                                <td style="padding: 12px 0 12px 10px;">
                                                    <p style="margin: 0; color: #333; font-size: 14px; font-weight: 600;">Notification</p>
                                                    <p style="margin: 5px 0 0 0; color: #666; font-size: 13px; line-height: 1.5;">
                                                        We will contact you via email regarding next steps
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 12px 0; vertical-align: top;">
                                                    <div style="background-color: #8B1538; color: #ffffff; width: 32px; height: 32px; border-radius: 50%; text-align: center; line-height: 32px; font-weight: 600; font-size: 14px;">4</div>
                                                </td>
                                                <td style="padding: 12px 0 12px 10px;">
                                                    <p style="margin: 0; color: #333; font-size: 14px; font-weight: 600;">Interview (if selected)</p>
                                                    <p style="margin: 5px 0 0 0; color: #666; font-size: 13px; line-height: 1.5;">
                                                        Finalists will be invited for a personal or virtual interview
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>

                                    <!-- Additional Info -->
                                    <div style="background-color: #fff9f0; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                                        <p style="margin: 0 0 10px 0; color: #333; font-size: 14px;">
                                            <strong>Need to submit additional documents?</strong>
                                        </p>
                                        <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                                            If you need to provide additional information or documents, please contact us at 
                                            <a href="mailto:${process.env.EMAIL_FROM}" style="color: #8B1538; text-decoration: none; font-weight: 600;">${process.env.EMAIL_FROM}</a>
                                        </p>
                                    </div>

                                    <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 30px 0 0 0;">
                                        We wish you the very best of luck with your application! Your commitment to education and personal growth is commendable.
                                    </p>
                                    
                                    <p style="color: #333; font-size: 15px; margin: 25px 0 0 0;">
                                        Best wishes,<br>
                                        <strong style="color: #8B1538;">The Zonta Club of Naples Scholarship Committee</strong>
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 25px 30px; border-top: 1px solid #e9ecef; text-align: center;">
                                    <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 12px;">
                                        <strong>Empowering Women Through Education & Service</strong>
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
