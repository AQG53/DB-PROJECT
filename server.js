require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Import CORS middleware

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
