// backend/server.js
require('dotenv').config();           // loads backend/.env
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
  console.error('ERROR: Missing GMAIL_USER or GMAIL_APP_PASSWORD in backend/.env');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD }
});

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  const mailOptions = {
    from: GMAIL_USER,              // send from your Gmail account
    to: GMAIL_USER,                // receive at your Gmail account
    replyTo: email,                // reply goes to visitor's email
    subject: `Portfolio Contact: ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.json({ success: true });
  } catch (err) {
    console.error('Send error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
