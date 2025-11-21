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
