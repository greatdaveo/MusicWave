import express from "express";
import {
  getSingleSong,
  getSongs,
  PlayBackState,
} from "../controllers/songs.controller";
import { protectedRoute } from "../middleware/auth.middleware";
import {
  getSinglePlayList,
  PlayList,
} from "../controllers/playlist.controller";

const router = express.Router();

router.get("/songs", protectedRoute, getSongs);
router.get("/songs/:id", protectedRoute, getSingleSong);
router.post("/songs/:id/state", protectedRoute, PlayBackState);
router.post("/playlist", protectedRoute, PlayList);
router.get("/playlist/:id", protectedRoute, getSinglePlayList);

export default router;
