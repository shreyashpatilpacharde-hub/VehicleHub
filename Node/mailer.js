const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS
    }
});

// Verify SMTP connection on startup and log result
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP Connection Failed:", error.message);
        console.error("   BREVO_SMTP_USER:", process.env.BREVO_SMTP_USER ? "SET" : "MISSING");
        console.error("   BREVO_SMTP_PASS:", process.env.BREVO_SMTP_PASS ? "SET" : "MISSING");
        console.error("   BREVO_FROM_EMAIL:", process.env.BREVO_FROM_EMAIL ? process.env.BREVO_FROM_EMAIL : "MISSING");
    } else {
        console.log("✅ SMTP Server is ready to send emails");
    }
});

module.exports = transporter;