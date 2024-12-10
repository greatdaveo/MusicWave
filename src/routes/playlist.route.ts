import express from "express";
import {
  addSongToPlaylist,
  createPlayList,
  deletePlayList,
  deleteSongFromPlaylist,
  getAllPlaylist,
  getSinglePlayList,
  getUserProfileAndPlaylists,
  updatePlayList,
} from "../controllers/playlist.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/playlist/all-playlists", protectedRoute, getAllPlaylist);
router.get("/playlist/:id", protectedRoute, getSinglePlayList);
router.get("/users/:id/playlists", protectedRoute, getUserProfileAndPlaylists);
router.post("/playlist", protectedRoute, createPlayList);
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
