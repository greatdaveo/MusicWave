import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { getNotification } from "../controllers/notification.controller";

const router = express.Router();

router.get("/notifications/:id", protectedRoute, getNotification);

export default router;
