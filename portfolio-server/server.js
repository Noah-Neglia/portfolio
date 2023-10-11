const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path'); // Added to handle file paths
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app
console.log('Serving static files from:', path.join(__dirname, '../client/build'));
app.use(express.static(path.join(__dirname, '../portfolio-client/build')));

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-email', (req, res) => {
  const { name, organization, email, message } = req.body;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECEIVER,
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

// The "catchall" handler: for any request that doesn't
// match one directly above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../portfolio-client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
