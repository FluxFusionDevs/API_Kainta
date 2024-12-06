const nodemailer = require("nodemailer");

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.GMAIL_EMAIL, // Your Gmail address from environment variables
    pass: process.env.GMAIL_APP_PASSWORD, // Your generated app password from environment variables
  },
  tls: {
    ciphers: "SSLv3",
    minVersion: "TLSv1.2",
  },
});

exports.sendEmail = async (email, subject, message) => {
  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.GMAIL_EMAIL, // Your Gmail address from environment variables
    to: email,
    subject: subject,
    text: message,
  });

  console.log("Message sent: %s", info.messageId);
};
