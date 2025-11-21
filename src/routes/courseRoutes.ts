import express from "express";
import { saveProgress } from "../controllers/course.controller";
import { requireAuth } from "../middleware/user";

const router = express.Router();

router.post("/save", requireAuth, saveProgress);

export default router;
