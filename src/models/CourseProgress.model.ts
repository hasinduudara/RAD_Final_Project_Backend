import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: String, required: true },
    completedParts: { type: [Number], default: [] }
});

export default mongoose.model("CourseProgress", courseProgressSchema);
