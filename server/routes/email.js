const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const auth = require('../middleware/auth');
const User = require('../models/User');

const resend = new Resend(process.env.RESEND_API_KEY);

// Send Email
router.post('/send', auth, async (req, res) => {
    const { to, subject, body, isAllUsers } = req.body;

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

        const { data, error } = await resend.emails.send({
            from: 'Student Hub <onboarding@resend.dev>', // Default Resend test domain
            to: recipients,
            subject: subject,
            html: `<div>${body}</div>`,
        });

        if (error) {
            console.error(error);
            return res.status(400).json({ error });
        }

        res.json({ msg: 'Email(s) sent successfully', data });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
