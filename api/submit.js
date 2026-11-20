// Vercel Serverless Function: /api/submit
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(455).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const data = req.body;
        const respondent = data.respondent || {};

        if (!respondent.name || !respondent.designation || !respondent.email) {
            return res.status(400).json({ success: false, error: 'Required fields missing (name, designation, email).' });
        }

        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
        const referenceId = `VP-${datePart}-${randomPart}`;

        const recipientEmail = process.env.NOTIFICATION_EMAIL || 'vildigitalseo@gmail.com';

        let emailSent = false;
        let emailErr = null;

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '587', 10),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            const emailSubject = `New VilPower Website Content Submission – ${respondent.name.trim()}`;
            
            // Format HTML body
            const emailHtml = `
            <div style="font-family:sans-serif;background:#09090b;color:#f4f4f5;padding:24px;">
                <div style="max-width:800px;margin:0 auto;background:#111113;border:1px solid #27272a;border-radius:12px;padding:24px;">
                    <h2 style="color:#60a5fa;margin-top:0;">New VilPower Website Content Submission</h2>
                    <p><strong>Reference ID:</strong> ${referenceId}</p>
                    <p><strong>Respondent:</strong> ${respondent.name} (${respondent.designation})</p>
                    <p><strong>Department:</strong> ${respondent.department || 'N/A'}</p>
                    <p><strong>Email:</strong> ${respondent.email}</p>
                    <p><strong>Phone:</strong> ${respondent.phone || 'N/A'}</p>
                    <hr style="border:none;border-top:1px solid #27272a;margin:20px 0;">
                    <h3>Selected Pages:</h3>
                    <p>${(data.selectedPages || []).join(', ')}</p>
                    <hr style="border:none;border-top:1px solid #27272a;margin:20px 0;">
                    <pre style="background:#18181b;padding:16px;border-radius:8px;overflow-x:auto;color:#cbd5e1;">${JSON.stringify(data.sections || {}, null, 2)}</pre>
                </div>
            </div>`;

            await transporter.sendMail({
                from: process.env.SMTP_FROM || `"VilPower Portal" <${process.env.SMTP_USER}>`,
                to: recipientEmail,
                replyTo: respondent.email.trim(),
                subject: emailSubject,
                html: emailHtml
            });
            emailSent = true;
        }

        return res.status(200).json({
            success: true,
            referenceId,
            emailSent,
            emailRecipient: recipientEmail,
            message: 'Submission received successfully'
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}
