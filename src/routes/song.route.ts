import express from "express";
import { getSingleSong, getSongs } from "../controllers/songs.controller";

const router = express.Router();

router.get("/songs", getSongs);
router.get("/songs/:id", getSingleSong);

export default router;
