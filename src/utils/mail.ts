import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTPEmail = async (email: string, otp: string) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Password Reset OTP",
        html: `
            <h2>Your OTP Code</h2>
            <p>Your OTP code is: <b>${otp}</b></p>
            <p>This code is valid for <b>2 minutes</b>.</p>
        `,
    });
};

// Generic Email Sender (Required for Admin Panel)
export const sendEmail = async (to: string, subject: string, body: string) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        // Send both plain text and HTML (replacing newlines with <br> for HTML)
        text: body,
        html: `<p>${body.replace(/\n/g, "<br>")}</p>`,
    });
};