import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import {
  clearNotifications,
  getNotification,
  notificationReadStatus,
  pushNotification,
} from "../controllers/notification.controller";

const router = express.Router();

router.get("/notifications/:id", protectedRoute, getNotification);
router.post("/notifications", protectedRoute, pushNotification);
router.put("/notifications/:id", protectedRoute, notificationReadStatus);
router.delete("/notifications", protectedRoute, clearNotifications);

export default router;
