const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Nodemailer connection error:', error);
    } else {
        console.log('✅ Email server is ready to take our messages [Nodemailer/Gmail]');
    }
});

// Send Email
router.post('/send', auth, async (req, res) => {
    const { to, subject, body, isAllUsers } = req.body;

    console.log('=== EMAIL SEND REQUEST (NODEMAILER) ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Subject:', subject);
    console.log('Is All Users:', isAllUsers);

    try {
        // Only admin/superadmin can send emails
        const adminUser = await User.findById(req.user.id);
        if (!['admin', 'superadmin'].includes(adminUser.role)) {
            return res.status(403).json({ msg: 'Access denied' });
        }

        let recipients = [];
        if (isAllUsers) {
            const users = await User.find({ role: 'user' }).select('email');
            recipients = users.map(u => u.email).filter(e => e);
        } else {
            recipients = Array.isArray(to) ? to : [to];
        }

        if (recipients.length === 0) {
            return res.status(400).json({ msg: 'No recipients found' });
        }

        console.log(`Preparing to send to ${recipients.length} recipients`);

        const mailOptions = {
            from: {
                name: 'Student Hub',
                address: process.env.EMAIL_USER
            },
            to: isAllUsers ? process.env.EMAIL_USER : recipients,
            bcc: isAllUsers ? recipients : undefined,
            subject: subject,
            html: `<div>${body}</div>`
        };

        console.log('Sending email via Nodemailer, Options:', {
            from: mailOptions.from,
            toCount: Array.isArray(mailOptions.to) ? mailOptions.to.length : 1,
            bccCount: Array.isArray(mailOptions.bcc) ? mailOptions.bcc.length : 0,
            subject: mailOptions.subject
        });

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully via Nodemailer:', info.messageId);

        res.json({
            msg: 'Email(s) sent successfully',
            recipientCount: recipients.length,
            messageId: info.messageId
        });
    } catch (err) {
        console.error('=== EMAIL SEND ERROR ===');
        console.error('Error:', err.message);
        console.error('Stack:', err.stack);

        res.status(500).json({
            msg: 'Failed to send email',
            error: err.message
        });
    }
});

module.exports = router;
