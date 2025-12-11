import { Router } from "express";
import {register, login, refreshToken, updateUser,
    getMe, getAllUsers, deleteUser} from "../controllers/user.controller";
import {requireAuth} from "../middleware/user";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);

router.get("/me", requireAuth, getMe);
router.put("/update", requireAuth, updateUser);

router.get("/all", requireAuth, getAllUsers);
router.delete("/delete/:id", requireAuth, deleteUser);

export default router;

