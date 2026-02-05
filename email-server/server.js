const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://student-2-3ow8.onrender.com', 'https://student-2.pages.dev'],
    credentials: true
}));

// Email Transporter Config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    },
    secure: true,
    logger: true,
    debug: true
});

// Verify Connection
transporter.verify((error, success) => {
    if (error) {
        console.error('Email Server Error:', error);
    } else {
        console.log('Email Server is ready to send messages');
    }
});

// Route to send email from User to Admin (Feedback/Contact)
app.post('/api/send-message', async (req, res) => {
    try {
        const { title, message, category, userEmail } = req.body;

        const mailOptions = {
            from: `"Student Hub Feedback" <${process.env.EMAIL_USER}>`, // Sender address (must be authenticated user)
            replyTo: userEmail, // User's email to reply to
            to: process.env.EMAIL_USER, // Send TO the admin/email owner
            subject: `[${category}] ${title}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0f172a;">New Feedback / Message</h2>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p><strong>From:</strong> ${userEmail || 'Anonymous'}</p>
                        <p><strong>Category:</strong> ${category}</p>
                        <p><strong>Title:</strong> ${title}</p>
                    </div>
                    <div style="font-size: 16px; line-height: 1.6;">
                        <strong>Message:</strong><br/>
                        ${message.replace(/\n/g, '<br/>')}
                    </div>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;" />
                    <p style="font-size: 12px; color: #64748b;">Sent via Student Hub Email Server</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        res.status(200).json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
    }
});

// Route to send broadcast/admin emails to users
app.post('/api/send-broadcast', async (req, res) => {
    try {
        const { to, subject, body, isAllUsers } = req.body; // to is array of emails

        console.log(`Sending broadcast to ${to?.length} recipients`);

        const mailOptions = {
            from: `"Student Hub Admin" <${process.env.EMAIL_USER}>`,
            bcc: to, // Use BCC for multiple recipients to hide emails from each other
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    ${body}
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;" />
                    <p style="font-size: 12px; color: #64748b;">Sent via Student Hub</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Broadcast sent: %s', info.messageId);

        res.status(200).json({ success: true, message: 'Emails sent successfully' });

    } catch (error) {
        console.error('Error sending broadcast:', error);
        res.status(500).json({ success: false, message: 'Failed to send emails', error: error.message });
    }
});



app.get('/', (req, res) => {
    res.send('Student Email Server is Running');
});

app.listen(PORT, () => {
    console.log(`Email Server running on port ${PORT}`);
});
