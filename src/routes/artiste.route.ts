import express from "express";
import { followArtiste, getArtiste } from "../controllers/user.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/artiste/:artisteId", protectedRoute, followArtiste);
router.get("/artiste/:artisteId", protectedRoute, getArtiste);

export default router;
