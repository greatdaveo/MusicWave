import express from "express";
import {
  createPlayList,
  deletePlayList,
  getSinglePlayList,
  updatePlayList,
} from "../controllers/playlist.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/playlist", protectedRoute, createPlayList);
router.get("/playlist/:id", protectedRoute, getSinglePlayList);
router.put("/playlist/:id", protectedRoute, updatePlayList);
router.delete("/playlist/:id", protectedRoute, deletePlayList);

export default router;
