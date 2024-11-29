require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Import CORS middleware
const crypto = require('crypto'); // For OTP generation

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors({
    origin: true, // Replace with your frontend's origin
    methods: ['POST', 'GET'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASSWORD, // Your Gmail App Password
    },
});

const OTP_STORAGE = {};
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString(); // Generates a random OTP
}

function sendOTP(email, otp) {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP for password reset is: ${otp}. This OTP is valid only for 5 minutes.`,
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p><em>This OTP is valid only for 5 minutes.</em></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending OTP:', error);
        } else {
            console.log('OTP sent successfully:', info.response);
        }
    });
}

app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        // Generate OTP
        const otp = generateOTP();

        // Store OTP temporarily with an expiration time (e.g., 10 minutes)
        OTP_STORAGE[email] = { otp, timestamp: Date.now() };

        // Send OTP to the faculty's email
        sendOTP(email, otp);

        res.status(200).send('OTP sent to your email');
    } catch (error) {
        console.error('Error generating or sending OTP:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otpEntered} = req.body;

    try {
        // Check if OTP exists for the email
        const storedOTP = OTP_STORAGE[email];

        if (!storedOTP) {
            return res.status(400).send('No OTP found for this email!');
        }

        // Check if OTP is valid (within 10 minutes) and matches the entered OTP
        const isOTPValid = storedOTP.otp === otpEntered && (Date.now() - storedOTP.timestamp < 300000); // 5 minutes expiration

        if (!isOTPValid) {
            return res.status(400).send('Invalid or expired OTP!');
        }


        // Remove OTP from storage after use
        delete OTP_STORAGE[email];

        res.status(200).send('Password reset successful');
    } catch (error) {
        console.error('Error verifying OTP or resetting password:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/send-email-student', async (req, res) => {
  const { email, username, password } = req.body;

  const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Student Portal Login Details',
      text: `Hello ${username},\n\nYour login credentials are:\nRollnumber: ${username}\nPassword: ${password}\nWebsite: http://192.168.0.104:3000/student.html`,
      html: `<p>Hello <strong>${username}</strong>,</p>
             <p>Your login credentials are:</p>
             <p><strong>Rollnumber:</strong> ${username}<br><strong>Password:</strong> ${password}<br><strong>Website: http://192.168.0.104:3000/student.html</p>`,
  };

  try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      res.status(200).send('Email sent successfully!');
  } catch (error) {
      console.error('Error in Nodemailer:', error.message); // Log error message
      res.status(500).send('Failed to send email.');
  }
});

app.post('/send-email-faculty', async (req, res) => {
    const { email, username, password } = req.body;
  
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your Faculty Portal Login Details',
        text: `Hello ${username},\n\nYour login credentials are:\nUsername: ${username}\nPassword: ${password}\nWebsite: http://192.168.0.104:3000/faculty.html`,
        html: `<p>Hello <strong>${username}</strong>,</p>
               <p>Your login credentials are:</p>
               <p><strong>Username:</strong> ${username}<br><strong>Password:</strong> ${password}<br><strong>Website: http://192.168.0.104:3000/faculty.html</p>`,
    };
  
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error in Nodemailer:', error.message); // Log error message
        res.status(500).send('Failed to send email.');
    }
  });

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
