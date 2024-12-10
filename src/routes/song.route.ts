import express from "express";
import {
  getLatestSongs,
  getRecentlyPlayedSongs,
  getSingleSong,
  getSongs,
  PlayBackState,
  songRecommendation,
  uploadSongs,
} from "../controllers/songs.controller";
import { artisteOnly, protectedRoute } from "../middleware/auth.middleware";
import { getFollowedArtiste } from "../controllers/user.controller";
import { upload } from "../middleware/songs.middleware";

const router = express.Router();

router.get("/artist/songs", protectedRoute, getFollowedArtiste);
router.get("/songs/new", protectedRoute, getLatestSongs);
router.get("/songs/recent", protectedRoute, getRecentlyPlayedSongs);
router.get("/songs/recommended", protectedRoute, songRecommendation);
router.get("/songs", protectedRoute, getSongs);
router.get("/songs/:id", protectedRoute, getSingleSong);
router.post(
  "/songs/upload",
  protectedRoute,
  artisteOnly,
  upload.single("music"),
  uploadSongs
);
router.post("/songs/:id/state", protectedRoute, PlayBackState);

export default router;
