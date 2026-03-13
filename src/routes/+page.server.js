import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer'; // Example using Nodemailer
import { CONTACT_EMAIL, FROM_EMAIL, SMTP_PASS, SMTP_USER } from '$env/static/private'; // Use environment variables for security

export const actions = {
    submitMail: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Perform basic server-side validation
        if (!name || !email || !message) {
            return fail(400, { missing: true, message: 'All fields are required.' });
        }

        // Use a third-party service or NodeMailer to send the email
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // Replace with your SMTP host (e.g., Gmail, SendGrid, etc.)
            port: 465,
            secure: true, // Use 'true' for 465, 'false' for other ports
            auth: {
                user: SMTP_USER, // Your SMTP username
                pass: SMTP_PASS  // Your SMTP password or app password
            }
        });

        try {
            await transporter.sendMail({
                from: FROM_EMAIL,
                to: CONTACT_EMAIL, // The recipient of the form submission
                subject: `New Contact Form Submission from ${name}`,
                html: `
                    <p>Name: ${name}</p>
                    <p>Email: ${email}</p>
                    <p>Message: ${message}</p>
                `
            });
            return { success: true, message: 'Message sent successfully!' };
        } catch (error) {
            console.error(error);
            return fail(500, { error: true, message: 'Failed to send message.' });
        }
    }
};
