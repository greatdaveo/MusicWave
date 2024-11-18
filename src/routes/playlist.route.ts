import express from "express";
import {
  addSongToPlaylist,
  createPlayList,
  deletePlayList,
  deleteSongFromPlaylist,
  getSinglePlayList,
  updatePlayList,
} from "../controllers/playlist.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/playlist", protectedRoute, createPlayList);
router.get("/playlist/:id", protectedRoute, getSinglePlayList);
router.put("/playlist/:id", protectedRoute, updatePlayList);
router.delete("/playlist/:id", protectedRoute, deletePlayList);
router.post(
  "/playlist/:playlistId/songs/:songId",
  protectedRoute,
  addSongToPlaylist
);
router.delete(
  "/playlist/:playlistId/songs/:songId",
  protectedRoute,
  deleteSongFromPlaylist
);

export default router;
