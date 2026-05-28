require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Allow requests from any origin (good for file:/// testing)

// Rate Limiting (Spam protection)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 requests per `window`
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/send-message', apiLimiter);

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services or SMTP details
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

app.post('/send-message', async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Basic backend validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const mailOptions = {
            from: process.env.SMTP_USER, // Sender address (your authenticated email)
            to: process.env.RECEIVER_EMAIL, // Receiver address
            subject: `Contact Form: ${subject}`,
            text: `Sender Name: ${name}\nSender Email: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
            replyTo: email
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
