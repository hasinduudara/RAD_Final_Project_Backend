import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
}

export interface IChat extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    messages: IMessage[];
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ChatSchema = new Schema<IChat>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        messages: [MessageSchema]
    },
    { timestamps: true }
);

export default mongoose.model<IChat>("Chat", ChatSchema);
