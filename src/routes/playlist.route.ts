import express from "express";
import {
  createPlayList,
  getSinglePlayList,
  updatePlayList,
} from "../controllers/playlist.controller";
import { protectedRoute } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/playlist", protectedRoute, createPlayList);
router.get("/playlist/:id", protectedRoute, getSinglePlayList);
router.put("/playlist/:id", protectedRoute, updatePlayList);

export default router;
