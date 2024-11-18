import express from "express";
import {
  getSingleSong,
  getSongs,
  PlayBackState,
} from "../controllers/songs.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/songs", protectedRoute, getSongs);
router.get("/songs/:id", protectedRoute, getSingleSong);
router.get("/songs/:id/state", protectedRoute, PlayBackState);

export default router;
