import express from "express";
import { followArtiste } from "../controllers/user.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/artiste/:artistId", protectedRoute, followArtiste);

export default router;
