import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    profileImage?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        profileImage: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
