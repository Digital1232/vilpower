require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Ensure storage directories exist
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(SUBMISSIONS_FILE)) fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([], null, 2));

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static files
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(__dirname));

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
        cb(null, `${uniqueSuffix}-${safeName}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 } // 25MB max per file
});

// Helper: Read all submissions
function getSubmissions() {
    try {
        if (!fs.existsSync(SUBMISSIONS_FILE)) return [];
        const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
        return JSON.parse(raw || '[]');
    } catch (err) {
        console.error('Error reading submissions:', err);
        return [];
    }
}

// Helper: Save submissions atomically
function saveSubmissions(list) {
    const tmpPath = SUBMISSIONS_FILE + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(list, null, 2), 'utf8');
    fs.renameSync(tmpPath, SUBMISSIONS_FILE);
}

// Helper: Format HTML email for questionnaire
function formatSubmissionEmail(data, referenceId) {
    const respondent = data.respondent || {};
    const selectedPages = data.selectedPages || [];
    const sections = data.sections || {};
    const uploadedFiles = data.uploadedFiles || [];

    const nowStr = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'long'
    });

    let filesHtml = '';
    if (uploadedFiles.length > 0) {
        filesHtml = `
            <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:16px;margin-top:20px;">
                <h3 style="color:#60a5fa;margin:0 0 10px 0;font-size:16px;">Attached & Uploaded Reference Files (${uploadedFiles.length})</h3>
                <ul style="margin:0;padding-left:20px;color:#e4e4e7;line-height:1.7;">
                    ${uploadedFiles.map(f => `<li><a href="${f.url}" style="color:#38bdf8;text-decoration:underline;" target="_blank">${escapeHtml(f.originalName || f.name)}</a> <span style="color:#a1a1aa;font-size:12px;">(${Math.round((f.size || 0)/1024)} KB)</span></li>`).join('')}
                </ul>
            </div>
        `;
    }

    const renderJsonTree = (obj, indent = 0) => {
        if (!obj || typeof obj !== 'object') return escapeHtml(String(obj || ''));
        if (Array.isArray(obj)) {
            if (obj.length === 0) return '<em style="color:#71717a;">None provided</em>';
            return `<ul style="margin:4px 0;padding-left:20px;">` + obj.map(item => `<li>${renderJsonTree(item, indent + 1)}</li>`).join('') + `</ul>`;
        }
        let rows = '';
        for (const [k, v] of Object.entries(obj)) {
            if (v === null || v === undefined || v === '') continue;
            const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            rows += `
                <tr style="border-bottom:1px solid #27272a;">
                    <td style="padding:8px 12px;font-weight:600;color:#93c5fd;width:32%;vertical-align:top;background:#141416;">${escapeHtml(label)}</td>
                    <td style="padding:8px 12px;color:#f4f4f5;vertical-align:top;">${renderJsonTree(v, indent + 1)}</td>
                </tr>
            `;
        }
        return rows ? `<table style="width:100%;border-collapse:collapse;font-size:13px;margin:6px 0;">${rows}</table>` : '<em style="color:#71717a;">No data entered</em>';
    };

    let sectionsHtml = '';
    for (const [secKey, secVal] of Object.entries(sections)) {
        const secTitle = secKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        sectionsHtml += `
            <div style="background:#111113;border:1px solid #27272a;border-radius:10px;margin-bottom:20px;overflow:hidden;">
                <div style="background:#18181b;padding:12px 16px;border-bottom:1px solid #27272a;">
                    <h3 style="margin:0;color:#38bdf8;font-size:15px;letter-spacing:0.5px;">${escapeHtml(secTitle)}</h3>
                </div>
                <div style="padding:14px 16px;">
                    ${renderJsonTree(secVal)}
                </div>
            </div>
        `;
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>VilPower Content Submission</title>
    </head>
    <body style="margin:0;padding:24px;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f4f4f5;line-height:1.5;">
        <div style="max-width:850px;margin:0 auto;background:#0d0e12;border:1px solid #27272a;border-radius:12px;padding:32px;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
            
            <!-- Header -->
            <div style="border-bottom:1px solid #27272a;padding-bottom:20px;margin-bottom:24px;">
                <table style="width:100%;">
                    <tr>
                        <td>
                            <span style="display:inline-block;background:#1e3a8a;color:#93c5fd;font-size:11px;font-weight:700;letter-spacing:1px;padding:4px 10px;border-radius:20px;text-transform:uppercase;margin-bottom:8px;">VilPower Solutions</span>
                            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">New Website Content & Requirements Submission</h1>
                            <p style="margin:6px 0 0 0;color:#a1a1aa;font-size:14px;">Official Company Information & Content Questionnaire</p>
                        </td>
                        <td style="text-align:right;vertical-align:top;">
                            <div style="background:#18181b;border:1px solid #3f3f46;border-radius:8px;padding:8px 12px;display:inline-block;text-align:left;">
                                <div style="font-size:11px;color:#a1a1aa;text-transform:uppercase;">Reference ID</div>
                                <div style="font-size:15px;color:#38bdf8;font-weight:700;letter-spacing:0.5px;">${referenceId}</div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <!-- Respondent Card -->
            <div style="background:#141417;border:1px solid #27272a;border-radius:10px;padding:18px;margin-bottom:24px;">
                <h3 style="margin:0 0 12px 0;font-size:14px;color:#60a5fa;text-transform:uppercase;letter-spacing:0.8px;">Respondent Profile</h3>
                <table style="width:100%;border-collapse:collapse;font-size:14px;">
                    <tr>
                        <td style="padding:6px 0;color:#a1a1aa;width:25%;">Full Name:</td>
                        <td style="padding:6px 0;color:#ffffff;font-weight:600;">${escapeHtml(respondent.name || 'N/A')}</td>
                        <td style="padding:6px 0;color:#a1a1aa;width:25%;">Designation:</td>
                        <td style="padding:6px 0;color:#ffffff;">${escapeHtml(respondent.designation || 'N/A')}</td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0;color:#a1a1aa;">Department:</td>
                        <td style="padding:6px 0;color:#ffffff;">${escapeHtml(respondent.department || 'N/A')}</td>
                        <td style="padding:6px 0;color:#a1a1aa;">Official Email:</td>
                        <td style="padding:6px 0;color:#38bdf8;"><a href="mailto:${escapeHtml(respondent.email || '')}" style="color:#38bdf8;">${escapeHtml(respondent.email || 'N/A')}</a></td>
                    </tr>
                    <tr>
                        <td style="padding:6px 0;color:#a1a1aa;">Contact Number:</td>
                        <td style="padding:6px 0;color:#ffffff;">${escapeHtml(respondent.phone || 'N/A')}</td>
                        <td style="padding:6px 0;color:#a1a1aa;">Submission Time:</td>
                        <td style="padding:6px 0;color:#ffffff;">${nowStr}</td>
                    </tr>
                </table>
            </div>

            <!-- Selected Pages -->
            <div style="background:#141417;border:1px solid #27272a;border-radius:10px;padding:18px;margin-bottom:24px;">
                <h3 style="margin:0 0 10px 0;font-size:14px;color:#60a5fa;text-transform:uppercase;letter-spacing:0.8px;">Approved Website Pages (${selectedPages.length})</h3>
                <div style="margin-top:8px;">
                    ${selectedPages.map(p => `<span style="display:inline-block;background:#1e293b;border:1px solid #334155;color:#e2e8f0;padding:4px 10px;border-radius:6px;font-size:12px;margin:3px 4px 3px 0;">${escapeHtml(p)}</span>`).join('')}
                </div>
            </div>

            <!-- Uploaded Files -->
            ${filesHtml}

            <!-- Questionnaire Sections -->
            <h2 style="font-size:18px;color:#ffffff;margin:28px 0 16px 0;border-bottom:1px solid #27272a;padding-bottom:8px;">Questionnaire Responses</h2>
            ${sectionsHtml}

            <!-- Footer -->
            <div style="margin-top:32px;padding-top:20px;border-top:1px solid #27272a;color:#71717a;font-size:12px;text-align:center;">
                <p style="margin:0 0 6px 0;">VilPower Solutions India Private Limited &bull; Interactive Content Collection Portal</p>
                <p style="margin:0;">Delivered automatically to vildigitalseo@gmail.com &bull; Ref: ${referenceId}</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Route: Multi-file upload
app.post('/api/upload', upload.array('files', 15), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'No files uploaded' });
        }
        const fileData = req.files.map(f => ({
            originalName: f.originalname,
            filename: f.filename,
            size: f.size,
            mimetype: f.mimetype,
            url: `/uploads/${f.filename}`
        }));
        return res.json({ success: true, files: fileData });
    } catch (err) {
        console.error('File upload error:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Route: Submit questionnaire
app.post('/api/submit', async (req, res) => {
    try {
        const data = req.body;
        const respondent = data.respondent || {};

        // Validation
        if (!respondent.name || !respondent.name.trim()) {
            return res.status(400).json({ success: false, error: 'Respondent name is required.' });
        }
        if (!respondent.designation || !respondent.designation.trim()) {
            return res.status(400).json({ success: false, error: 'Respondent designation is required.' });
        }
        if (!respondent.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(respondent.email)) {
            return res.status(400).json({ success: false, error: 'A valid official email is required.' });
        }

        // Generate Reference ID
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
        const referenceId = `VP-${datePart}-${randomPart}`;

        const submissionRecord = {
            id: referenceId,
            submittedAt: new Date().toISOString(),
            status: 'Pending', // Pending, Reviewed, Approved
            respondent: {
                name: respondent.name.trim(),
                designation: respondent.designation.trim(),
                department: (respondent.department || '').trim(),
                email: respondent.email.trim(),
                phone: (respondent.phone || '').trim()
            },
            selectedPages: data.selectedPages || [],
            sections: data.sections || {},
            uploadedFiles: data.uploadedFiles || [],
            confirmation: data.confirmation || {},
            emailStatus: {
                sent: false,
                timestamp: null,
                error: null
            }
        };

        // Persist submission to JSON database immediately
        const submissions = getSubmissions();
        submissions.unshift(submissionRecord);
        saveSubmissions(submissions);

        // Attempt Email Dispatch
        const recipientEmail = process.env.NOTIFICATION_EMAIL || 'vildigitalseo@gmail.com';
        const emailSubject = `New VilPower Website Content Submission – ${respondent.name.trim()}`;
        const emailHtml = formatSubmissionEmail(data, referenceId);

        let emailSent = false;
        let emailErr = null;

        // Check if SMTP is configured
        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.SMTP_PORT || '587', 10),
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });

                await transporter.sendMail({
                    from: process.env.SMTP_FROM || `"VilPower Portal" <${process.env.SMTP_USER}>`,
                    to: recipientEmail,
                    replyTo: respondent.email.trim(),
                    subject: emailSubject,
                    html: emailHtml
                });

                emailSent = true;
                submissionRecord.emailStatus = {
                    sent: true,
                    timestamp: new Date().toISOString(),
                    error: null
                };
            } catch (mailError) {
                console.error('Nodemailer send error:', mailError.message);
                emailErr = mailError.message;
                submissionRecord.emailStatus = {
                    sent: false,
                    timestamp: new Date().toISOString(),
                    error: mailError.message
                };
            }
            // Update saved record with email result
            saveSubmissions(submissions);
        } else {
            console.log(`[INFO] Submission ${referenceId} saved successfully. SMTP credentials not set in .env; email dispatch logged.`);
            submissionRecord.emailStatus = {
                sent: false,
                timestamp: new Date().toISOString(),
                error: 'SMTP credentials not configured in .env'
            };
            saveSubmissions(submissions);
        }

        return res.json({
            success: true,
            referenceId,
            emailSent,
            emailRecipient: recipientEmail,
            emailWarning: emailErr ? `Saved securely, email dispatch error: ${emailErr}` : null,
            message: 'Your questionnaire submission has been securely recorded and queued.'
        });

    } catch (err) {
        console.error('Submit route error:', err);
        return res.status(500).json({ success: false, error: 'Server error processing submission: ' + err.message });
    }
});

// Route: Get all submissions (Admin)
app.get('/api/submissions', (req, res) => {
    try {
        const { search, status, date } = req.query;
        let list = getSubmissions();

        if (search) {
            const q = search.toLowerCase();
            list = list.filter(s =>
                (s.id && s.id.toLowerCase().includes(q)) ||
                (s.respondent?.name && s.respondent.name.toLowerCase().includes(q)) ||
                (s.respondent?.email && s.respondent.email.toLowerCase().includes(q)) ||
                (s.respondent?.designation && s.respondent.designation.toLowerCase().includes(q))
            );
        }

        if (status) {
            list = list.filter(s => s.status.toLowerCase() === status.toLowerCase());
        }

        if (date) {
            list = list.filter(s => s.submittedAt && s.submittedAt.startsWith(date));
        }

        return res.json({ success: true, total: list.length, submissions: list });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Route: Get single submission
app.get('/api/submissions/:id', (req, res) => {
    try {
        const submissions = getSubmissions();
        const found = submissions.find(s => s.id === req.params.id);
        if (!found) return res.status(404).json({ success: false, error: 'Submission not found' });
        return res.json({ success: true, submission: found });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Route: Update status (Reviewed / Pending / Approved)
app.patch('/api/submissions/:id/status', (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Reviewed', 'Approved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }
        const submissions = getSubmissions();
        const idx = submissions.findIndex(s => s.id === req.params.id);
        if (idx === -1) return res.status(404).json({ success: false, error: 'Submission not found' });

        submissions[idx].status = status;
        submissions[idx].updatedAt = new Date().toISOString();
        saveSubmissions(submissions);

        return res.json({ success: true, submission: submissions[idx] });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Route: Trigger email resend from admin
app.post('/api/submissions/:id/resend-email', async (req, res) => {
    try {
        const submissions = getSubmissions();
        const sub = submissions.find(s => s.id === req.params.id);
        if (!sub) return res.status(404).json({ success: false, error: 'Submission not found' });

        const recipientEmail = process.env.NOTIFICATION_EMAIL || 'vildigitalseo@gmail.com';
        const emailSubject = `[Resend] New VilPower Website Content Submission – ${sub.respondent?.name || sub.id}`;
        const emailHtml = formatSubmissionEmail(sub, sub.id);

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return res.status(400).json({ success: false, error: 'SMTP credentials are not configured in .env' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_FROM || `"VilPower Portal" <${process.env.SMTP_USER}>`,
            to: recipientEmail,
            replyTo: sub.respondent?.email,
            subject: emailSubject,
            html: emailHtml
        });

        sub.emailStatus = {
            sent: true,
            timestamp: new Date().toISOString(),
            error: null
        };
        saveSubmissions(submissions);

        return res.json({ success: true, message: `Email sent to ${recipientEmail}` });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` VilPower Content Portal Server running at:`);
    console.log(` http://localhost:${PORT}/content-portal.html`);
    console.log(` Notification recipient: ${process.env.NOTIFICATION_EMAIL || 'vildigitalseo@gmail.com'}`);
    console.log(`=======================================================`);
});
