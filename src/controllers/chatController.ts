import { Request, Response } from "express";
import Chat from "../models/Chat.model";
import { sendToOpenRouter } from "../utils/openrouterClient";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const createChat = async (req: Request, res: Response) => {
    try {
        const newChat = await Chat.create({
            user: req.user.id,
            title: "New Chat",
            messages: []
        });

        res.json(newChat);
    } catch (error) {
        res.status(500).json({ message: "Error creating chat" });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { chatId, content } = req.body;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        // Add user message
        chat.messages.push({ role: "user", content, createdAt: new Date() });
        await chat.save();

        // Prepare messages for AI
        const messages = chat.messages.map((m) => ({
            role: m.role,
            content: m.content
        }));

        let aiResponse = await sendToOpenRouter(messages);

        // Clean AI response
        aiResponse = aiResponse.replace(/[*_`~]/g, "").trim();

        // Shorten and split into sections
        const sections = aiResponse
            .split(/(?<=[.?!])\s+/) // split by sentence
            .slice(0, 3) // take first 2-3 sentences for brevity
            .join("\n");

        // Save assistant response
        chat.messages.push({
            role: "assistant",
            content: sections,
            createdAt: new Date()
        });

        await chat.save();

        res.json({ reply: sections, chat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "AI request failed" });
    }
};

export const getChats = async (req: Request, res: Response) => {
    try {
        const chats = await Chat.find({ user: req.user.id }).select("title createdAt");
        res.json(chats);
    } catch {
        res.status(500).json({ message: "Could not load chats" });
    }
};

export const getChatById = async (req: Request, res: Response) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        res.json(chat);
    } catch {
        res.status(500).json({ message: "Error loading chat" });
    }
};

export const deleteChat = async (req: Request, res: Response) => {
    try {
        const chat = await Chat.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if (!chat) return res.status(404).json({ message: "Chat not found" });
        res.json({ message: "Chat deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete chat" });
    }
};
