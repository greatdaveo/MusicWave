import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import {
  clearNotifications,
  getNotification,
  pushNotification,
} from "../controllers/notification.controller";

const router = express.Router();

router.get("/notifications/:id", protectedRoute, getNotification);
router.post("/notifications", protectedRoute, pushNotification);
router.delete("/notifications", protectedRoute, clearNotifications);

export default router;
