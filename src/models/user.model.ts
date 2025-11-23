import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    role: "USER" | "ADMIN";
    profileImage?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
        profileImage: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
