import { Request, Response } from "express";
import Progress from "../models/CourseProgress.model";

export const saveProgress = async (req: Request, res: Response) => {
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
        if (!record.completedParts.includes(part)) {
            record.completedParts.push(part);
            await record.save();
        }
    }

    res.json({ success: true, completed: record.completedParts });
};

export const getProgress = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const records = await Progress.find({ userId });

        const progressData = records.map((r) => ({
            id: r._id.toString(),
            courseName: r.course,
            // CHANGE THIS LINE: Return the array, not the length
            completedParts: r.completedParts
        }));

        res.json(progressData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch course progress" });
    }
};