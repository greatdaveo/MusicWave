import express from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import {
  getNotification,
  pushNotification,
} from "../controllers/notification.controller";

const router = express.Router();

router.get("/notifications/:id", protectedRoute, getNotification);
router.post("/notifications", protectedRoute, pushNotification);

export default router;
