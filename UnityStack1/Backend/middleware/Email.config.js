const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "info.freshrose@gmail.com", // Replace with your email
    pass: "btfx cegj vgnh jzww", // Replace with your app password
  },
});

// Function to send an email
const SendEmail = async (email, verificationCode) => {
  try {
    const info = await transporter.sendMail({
      from: '"UnityStack" <info.freshrose@gmail.com>', // Sender address
      to: email, // Receiver's email
      subject: "Verify your account", // Subject line
      text: `Your verification code is: ${verificationCode}`, // Plain text body
      html: `<p>Your verification code is: <b>${verificationCode}</b></p>`, // HTML body
    });

    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email.");
  }
};

// Exporting transporter and SendEmail function
module.exports = { transporter, SendEmail };
