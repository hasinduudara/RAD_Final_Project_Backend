import express from "express";
import {getProgress, saveProgress} from "../controllers/course.controller";
import { requireAuth } from "../middleware/user";

const router = express.Router();

router.post("/save", requireAuth, saveProgress);
router.get("/progress", requireAuth, getProgress);

export default router;
