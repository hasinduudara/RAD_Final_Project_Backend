import express from "express";
import {
    requestPasswordReset,
    verifyOTP,
    resetPassword,
} from "../controllers/password.controller";

const router = express.Router();

router.post("/forgot", requestPasswordReset);
router.post("/verify-otp", verifyOTP);
router.post("/reset", resetPassword);

export default router;
