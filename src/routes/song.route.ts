import express from "express";
import { getSongs } from "../controllers/songs.controller";

const router = express.Router();

router.get("/songs", getSongs);

export default router;
