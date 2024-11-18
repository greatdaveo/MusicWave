import express from "express";
import {
  getSingleSong,
  getSongs,
  PlayBackState,
  PlayList,
} from "../controllers/songs.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/songs", protectedRoute, getSongs);
router.get("/songs/:id", protectedRoute, getSingleSong);
router.post("/songs/:id/state", protectedRoute, PlayBackState);
router.post("/playlist", protectedRoute, PlayList);

export default router;
