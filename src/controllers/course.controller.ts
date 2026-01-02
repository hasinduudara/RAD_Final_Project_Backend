import { Request, Response } from "express";
import Progress from "../models/CourseProgress.model";

export const saveProgress = async (req: Request, res: Response) => {
    try {
        // 1. Safety Check: Ensure user exists
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { course, part } = req.body;
        const userId = req.user.id;

        let record = await Progress.findOne({ userId, course });

        if (!record) {
            record = await Progress.create({
                userId,
                course,
                completedParts: [part]
            });
        } else {
            // Check if part exists (handle string vs number mismatches safely)
            if (!record.completedParts.includes(part)) {
                record.completedParts.push(part);
                await record.save();
            }
        }

        // 2. SUCCESS RESPONSE
        res.status(200).json({ success: true, completed: record.completedParts });

    } catch (error) {
        console.error("Save Progress Error:", error);
        // 3. ERROR RESPONSE (Prevents the "Hanging" issue)
        res.status(500).json({ success: false, message: "Server error saving progress" });
    }
};

export const getProgress = async (req: Request, res: Response) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const userId = req.user.id;
        const records = await Progress.find({ userId });

        const progressData = records.map((r) => ({
            id: r._id.toString(),
            courseName: r.course,
            completedParts: r.completedParts
        }));

        res.json(progressData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch course progress" });
    }
};