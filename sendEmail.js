const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASSWORD, // Your Gmail app password
    },
});

// Function to send email
async function sendEmail(to, username, password) {
    const mailOptions = {
        from: process.env.GMAIL_USER, // Sender address
        to, // Recipient email
        subject: 'Welcome to the Student Portal',
        text: `Dear Student,\n\nYour account has been successfully created.\n\nYour login details:\nUsername: ${username}\nPassword: ${password}\n\nBest Regards,\nYour School Team`,
        html: `<p>Dear Student,</p>
               <p>Your account has been successfully created.</p>
               <p><strong>Login Details:</strong><br>Username: ${username}<br>Password: ${password}</p>
               <p>Best Regards,<br>Your School Team</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
}

module.exports = sendEmail;
