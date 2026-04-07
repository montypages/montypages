import { fail } from '@sveltejs/kit';
import nodemailer from 'nodemailer'; // Example using Nodemailer
import {
	CONTACT_EMAIL,
	FROM_EMAIL,
	SMTP_PASS,
	SMTP_USER,
	RECAPTCHA_SECRET_KEY
} from '$env/static/private'; // Use environment variables for security

export const actions = {
	/** @param {import('@sveltejs/kit').RequestEvent} event */
	submitMail: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name');
		const email = formData.get('email');
		const message = formData.get('message');
		const token = formData.get('g-recaptcha-response');

		const secret = RECAPTCHA_SECRET_KEY;

		const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: `secret=${secret}&response=${token}`
		});

		const data = await res.json();

		if (!data.success) {
			return { success: false, error: 'reCAPTCHA failed' };
		}

		// Perform basic server-side validation
		if (!name || !email || !message) {
			return fail(400, { missing: true, message: '<p>All fields are required.</p>' });
		}

		// Use a third-party service or NodeMailer to send the email
		/** @type {import('nodemailer/lib/smtp-transport').Options} */
		const transportOptions = {
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			tls: /** @type {any} */ ({ family: 4, rejectUnauthorized: false }),
			auth: {
				user: CONTACT_EMAIL,
				pass: SMTP_PASS
			}
		};

		const transporter = nodemailer.createTransport(transportOptions);

		try {
			// Email notification for me
			await transporter.sendMail({
				from: FROM_EMAIL,
				to: CONTACT_EMAIL,
				subject: `New Contact Form Submission from ${name}`,
				html: `
                    <p>Name: ${name}</p>
                    <p>Email: ${email}</p>
                    <p>Message: ${message}</p>
                `
			});
			// Email notification for user
			await transporter.sendMail({
				from: FROM_EMAIL,
				to: email, // The recipient of the form submission
				subject: `Thanks for reaching out!`,
				html: `
                    <h2>${name}, thanks for reaching out!</h2>
                    <p>We aim to get back to you within 1 business day.</p>
                    <img src='cid:logo' width='200' alt='Monty Pages'>
                `,
				attachments: [
					{
						filename: 'logo-2.svg',
						path: 'src/lib/assets/logo-2.svg',
						cid: 'logo' // 👈 must match the cid in the img src
					}
				]
			});
			return {
				success: true,
				message: `
                <h2>Thanks for reaching out!</h2>
                <p>We aim to get back to you within 1 business day.</p>
                <img src='src/lib/assets/logo-2.svg' width=200 height=auto alt='Monty Pages'>
                `
			};
		} catch (error) {
			console.error(error);
			return fail(500, { error: true, message: '<p>Failed to send message.</p>' });
		}
	}
};
