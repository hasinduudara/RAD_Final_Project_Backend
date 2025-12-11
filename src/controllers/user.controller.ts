import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user.model";
import { sendEmail } from "../utils/mail";

import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../utils/tokens";

const passwordIsValid = (pw: string) => {
    if (pw.length < 5) return false;
    const hasUpper = /[A-Z]/.test(pw);
    const hasLower = /[a-z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    return hasUpper && hasLower && hasNumber;
};

export const register = async (req: Request, res: Response) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!passwordIsValid(password)) {
            return res.status(400).json({
                message:
                    "Password must be at least 5 characters and include uppercase, lowercase and numbers.",
            });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: "Email already registered." });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            email: email.toLowerCase(),
            password: hashed,
        });

        const accessToken = signAccessToken(user as IUser);
        const refreshToken = signRefreshToken(user as IUser);

        return res.status(201).json({
            message: "User registered.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
            accessToken,
            refreshToken,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "Email and password required." });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ message: "Invalid credentials." });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: "Invalid credentials." });

        const accessToken = signAccessToken(user as IUser);
        const refreshToken = signRefreshToken(user as IUser);

        return res.json({
            message: "Login successful",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
            accessToken,
            refreshToken,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Exchange refresh token for a new access token.
 * Client should send { refreshToken }
 */
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken: token } = req.body;
        if (!token) return res.status(400).json({ message: "No token provided." });

        const data = verifyRefreshToken(token) as any;
        if (!data) return res.status(401).json({ message: "Invalid token." });

        const userId = data.sub;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        const accessToken = signAccessToken(user as IUser);
        const refreshToken = signRefreshToken(user as IUser); // optionally issue new refresh token

        return res.json({
            accessToken,
            refreshToken,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Protected welcome route
 */
export const welcome = async (req: Request, res: Response) => {
    // `req.user` will be attached by middleware
    const user = (req as any).user;
    res.json({
        message: `Welcome ${user.fullName}! This route is protected.`,
        user,
    });
};

export const getMe = async (req: Request, res: Response) => {
    try {
        // Fetch full user data from database including profileImage
        const user = await User.findById(req.user._id).select("-password");

        return res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user data"
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { fullName, email, profileImage } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                ...(fullName && { fullName }),
                ...(email && { email }),
                ...(profileImage && { profileImage })  // Make sure this line exists
            },
            { new: true }
        ).select("-password");

        return res.json({ success: true, user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating user" });
    }
};

// Get all users (Admins & Students)
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Fetch all users but hide passwords
        const users = await User.find().select("-password");
        return res.json({ success: true, users });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error fetching users" });
    }
}

// Delete User & Send Email
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body; // We will send this from frontend

        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found." });
        }

        // Send Email Notification
        // Note: Ensure your 'utils/mail.ts' has a function like this, or adjust accordingly.
        try {
            await sendEmail(
                userToDelete.email,
                "Language Hub - Account Removed",
                `Your account has been removed.\n\nReason: ${reason}`
            );
        } catch (mailError) {
            console.error("Failed to send email:", mailError);
            // We continue to delete even if email fails, but log it.
        }

        // Remove User
        await User.findByIdAndDelete(id);

        return res.json({ success: true, message: "User removed successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error deleting user" });
    }
};

