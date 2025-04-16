"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const playlist_controller_1 = require("../controllers/playlist.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/playlist/all-playlists", auth_middleware_1.protectedRoute, playlist_controller_1.getAllPlaylist);
router.get("/playlist/:id", auth_middleware_1.protectedRoute, playlist_controller_1.getSinglePlayList);
router.get("/users/:id/playlists", auth_middleware_1.protectedRoute, playlist_controller_1.getUserProfileAndPlaylists);
router.post("/playlist", auth_middleware_1.protectedRoute, playlist_controller_1.createPlayList);
router.put("/playlist/:id", auth_middleware_1.protectedRoute, playlist_controller_1.updatePlayList);
router.delete("/playlist/:id", auth_middleware_1.protectedRoute, playlist_controller_1.deletePlayList);
router.post("/playlist/:playlistId/songs/:songId", auth_middleware_1.protectedRoute, playlist_controller_1.addSongToPlaylist);
router.delete("/playlist/:playlistId/songs/:songId", auth_middleware_1.protectedRoute, playlist_controller_1.deleteSongFromPlaylist);
exports.default = router;
