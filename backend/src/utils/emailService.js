import nodemailer, { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
import { membershipAdminEmailTemplate } from './emailTemplates/membershipAdminEmail.js';
import { membershipApplicantEmailTemplate } from './emailTemplates/membershipApplicantEmail.js';
import { membershipApprovalEmailTemplate } from './emailTemplates/membershipApprovalEmail.js';
import { membershipRenewalReminderTemplate } from './emailTemplates/membershipRenewalEmail.js';
import { scholarshipAdminEmailTemplate } from './emailTemplates/scholarshipAdminEmail.js';
import { scholarshipApplicantEmailTemplate } from './emailTemplates/scholarshipApplicantEmail.js';
import { eventRsvpConfirmationEmail } from './emailTemplates/eventRsvpConfirmationEmail.js';
import { eventReminderEmail } from './emailTemplates/eventReminderEmail.js';

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

// Send membership approval email with payment link
export const sendMembershipApprovalEmail = async (member, paymentUrl) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: member.email,
        subject: '🎉 Membership Approved - Complete Your Payment',
        html: membershipApprovalEmailTemplate(member, paymentUrl)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Membership approval email sent to ${member.email}`);
    } catch (error) {
        console.error('Error sending membership approval email:', error);
        throw new Error('Failed to send membership approval email');
    }
};

// Send membership renewal reminder with payment link
export const sendMembershipRenewalReminder = async (member, paymentUrl) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: member.email,
        subject: '⏰ Membership Renewal Reminder - Zonta Club of Naples',
        html: membershipRenewalReminderTemplate(member, paymentUrl)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Renewal reminder email sent to ${member.email}`);
    } catch (error) {
        console.error('Error sending renewal reminder email:', error);
        throw new Error('Failed to send renewal reminder email');
    }
};

// Send event RSVP confirmation email
export const sendEventRsvpConfirmation = async (event, attendeeEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: attendeeEmail,
        subject: `RSVP Confirmed: ${event.title}`,
        html: eventRsvpConfirmationEmail(event, attendeeEmail)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Event RSVP confirmation sent to ${attendeeEmail}`);
    } catch (error) {
        console.error('Error sending event RSVP confirmation:', error);
        throw new Error('Failed to send event RSVP confirmation');
    }
};

// Send event reminder email (24 hours before)
export const sendEventReminder = async (event, attendeeEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: attendeeEmail,
        subject: `Reminder: ${event.title} - Tomorrow!`,
        html: eventReminderEmail(event, attendeeEmail)
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Event reminder sent to ${attendeeEmail}`);
    } catch (error) {
        console.error('Error sending event reminder:', error);
        throw new Error('Failed to send event reminder');
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
