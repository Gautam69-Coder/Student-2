const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Create Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, //  Gmail
        pass: process.env.EMAIL_PASS // Gmail App Password
    }
});


// Send Email
router.post('/send', auth, async (req, res) => {
    const { to, subject, body, isAllUsers } = req.body;
    console.log(to,subject,isAllUsers,body);

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

        // Setup email data
        const mailOptions = {
            from: `"Student Hub" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send it to yourself
            bcc: recipients, // Hide recipients from each other
            subject: subject,
            html: `<div>${body}</div>`
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.json({ msg: 'Email(s) sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error: ' + err.message);
    }
});

module.exports = router;
