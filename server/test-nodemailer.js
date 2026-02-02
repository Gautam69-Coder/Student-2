require('dotenv').config();
const nodemailer = require('nodemailer');

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

if (!user || !pass) {
    console.error('Missing EMAIL_USER or EMAIL_PASS in .env');
    process.exit(1);
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: user,
        pass: pass
    }
});

const mailOptions = {
    from: user,
    to: user, // Send to self
    subject: 'Test Email from Nodemailer',
    text: 'If you receive this, Nodemailer is working correctly with your Gmail App Password!',
    html: '<strong>If you receive this, Nodemailer is working correctly with your Gmail App Password!</strong>'
};

console.log('Attempting to send email via Nodemailer...');
console.log(`From: ${user}`);

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
    } else {
        console.log('✅ Email sent successfully: ' + info.response);
    }
});
