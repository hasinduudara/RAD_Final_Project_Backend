import { Request, Response } from "express";
import User from "../models/user.model";
import ResetToken from "../models/resetToken.model";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../utils/mail";

const passwordIsValid = (pw: string) => {
    if (pw.length < 5) return false;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    return hasUpper && hasLower && hasNumber;
};

// Step 1: Request OTP
export const requestPasswordReset = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Email not found." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await ResetToken.deleteMany({ email });

    await ResetToken.create({
        email,
        otp,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });

    await sendOTPEmail(email, otp);

    res.json({ message: "OTP sent to your email." });
};

// Step 2: Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    const record = await ResetToken.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP." });

    if (record.expiresAt < new Date()) {
        return res.status(400).json({ message: "OTP expired." });
    }

    res.json({ message: "OTP verified." });
};

// Step 3: Reset password
export const resetPassword = async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;

    if (!passwordIsValid(newPassword)) {
        return res.status(400).json({
            message:
                "Password must be at least 5 characters and include uppercase, lowercase and numbers.",
        });
    }

    const record = await ResetToken.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP." });

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate({ email }, { password: hashed });

    await ResetToken.deleteMany({ email });

    res.json({ message: "Password reset successful." });
};
