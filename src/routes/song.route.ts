import express from "express";
import {
  getLatestSongs,
  getLikedSongs,
  getRecentlyPlayedSongs,
  getSingleSong,
  getSongs,
  PlayBackState,
  saveLikedSongs,
  songRecommendation,
  uploadSongs,
} from "../controllers/songs.controller";
import { artisteOnly, protectedRoute } from "../middleware/auth.middleware";
import { getFollowedArtiste } from "../controllers/user.controller";
import { upload } from "../middleware/songs.middleware";

const router = express.Router();

router.get("/songs/likes", protectedRoute, getLikedSongs);
router.get("/artist/songs", protectedRoute, getFollowedArtiste);
router.get("/songs/new", protectedRoute, getLatestSongs);
router.get("/songs/recent", protectedRoute, getRecentlyPlayedSongs);
router.get("/songs/recommended", protectedRoute, songRecommendation);
router.get("/songs", protectedRoute, getSongs);
router.get("/songs/:id", protectedRoute, getSingleSong);
router.post("/songs/likes/:songId", protectedRoute, saveLikedSongs);
router.post(
  "/songs/upload",
  protectedRoute,
  artisteOnly,
  upload.single("music"),
  uploadSongs
);
router.post("/songs/:id/state", protectedRoute, PlayBackState);

export default router;
