import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/user";
import passwordRoutes from "./routes/password.routes";
import chatRoutes from "./routes/chatRoutes";
import courseRoutes from "./routes/courseRoutes";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173"], // frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());

// Default route
app.get("/", (req, res) => {
    res.send("🌍 Language Hub Platform API is running...");
});

// User routes (registration, login, refresh, welcome)
app.use("/api/v1/user", userRoutes);

// Forgot Password routes
app.use("/api/password", passwordRoutes);

// AI Chat routes
app.use("/api/chat", chatRoutes);

// Course Progress routes
app.use("/api/course", courseRoutes);

// Save progress route
app.use("/api/v1/course", courseRoutes);

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI || "")
    .then(async () => {
        console.log("✅ MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
