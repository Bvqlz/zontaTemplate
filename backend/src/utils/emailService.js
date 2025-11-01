import nodemailer, { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
import { membershipAdminEmailTemplate } from './emailTemplates/membershipAdminEmail.js';
import { membershipApplicantEmailTemplate } from './emailTemplates/membershipApplicantEmail.js';
import { scholarshipAdminEmailTemplate } from './emailTemplates/scholarshipAdminEmail.js';
import { scholarshipApplicantEmailTemplate } from './emailTemplates/scholarshipApplicantEmail.js';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export const sendMemberShipApplicationEmail = async (applicationData) => {
    const { firstName, lastName, email } = applicationData;

    const adminMailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `New Membership Application - ${firstName} ${lastName}`,
        html: membershipAdminEmailTemplate(applicationData)
    };

    const applicantMailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Application Received - Zonta Club of Naples',
        html: membershipApplicantEmailTemplate(applicationData)
    };

    try {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(applicantMailOptions);
        console.log('Membership application emails sent successfully!');
    } catch (error) {
        console.error('Error sending membership application emails:', error);
        throw new Error('Failed to send membership application emails');
    }
};

export const sendScholarshipApplicationEmail = async (applicationData, files = []) => {
    const { firstName, lastName, email } = applicationData;

    const adminMailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `New Scholarship Application - ${firstName} ${lastName}`,
        html: scholarshipAdminEmailTemplate(applicationData, files)
    };

    const applicantMailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Scholarship Application Received - Zonta Club of Naples',
        html: scholarshipApplicantEmailTemplate(applicationData, files)
    };

    try {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(applicantMailOptions);
        console.log('Scholarship application sent successfully');
    } catch (error) {
        console.error('Error sending scholarship:', error);
        throw new Error('Failed to send email');
    }
};

export const testEmailConnection = async () => {
    const testTransporter = createTransport();

    try {
        await testTransporter.verify();
        console.log('email server ready');
        return true;
    } catch(error) {
        console.error('email server not ready:', error);
        return false;
    }
};
