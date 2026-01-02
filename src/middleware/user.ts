import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/tokens";
import User from "../models/user.model";

export const requireAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const header = req.headers.authorization;
        if (!header) return res.status(401).json({ message: "No token provided." });

        const parts = header.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer")
            return res.status(401).json({ message: "Invalid authorization header." });

        const token = parts[1];
        const decoded = verifyAccessToken(token) as any;
        if (!decoded) return res.status(401).json({ message: "Invalid token." });

        const user = await User.findById(decoded.sub).select("-password");
        if (!user) return res.status(404).json({ message: "User not found." });

        (req as any).user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized." });
    }
};
