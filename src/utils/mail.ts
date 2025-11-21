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
