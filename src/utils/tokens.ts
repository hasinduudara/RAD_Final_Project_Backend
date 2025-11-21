import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { IUser } from "../models/user.model";

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

export const signAccessToken = (user: IUser): string => {
    return jwt.sign(
        {
            sub: (user._id as mongoose.Types.ObjectId).toString(),
            role: user.role,
            email: user.email,
            fullName: user.fullName,
        },
        ACCESS_SECRET,
        { expiresIn: "30m" }
    );
};

export const signRefreshToken = (user: IUser): string => {
    return jwt.sign(
        {
            sub: (user._id as mongoose.Types.ObjectId).toString(),
        },
        REFRESH_SECRET,
        { expiresIn: "7d" }
    );
};

export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, ACCESS_SECRET);
    } catch (err) {
        return null;
    }
};

export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, REFRESH_SECRET);
    } catch (err) {
        return null;
    }
};
