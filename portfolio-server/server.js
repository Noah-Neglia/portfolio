const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');  // Add this line to import the 'path' module
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());  // Add this line to use express's built-in middleware to parse JSON bodies
app.use(express.static(path.join(__dirname, '../portfolio-client/build')));

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../portfolio-client/build', 'index.html'));
});

app.post('/send-email', (req, res) => {
  const { name, organization, email, message } = req.body;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Updated to use environment variable
    to: process.env.EMAIL_RECEIVER,  // Updated to use environment variable, make sure to define it
    replyTo: email,
    subject: `Message from ${name} at ${organization}`,
    text: message
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
