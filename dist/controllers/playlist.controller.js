"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileAndPlaylists = exports.getAllPlaylist = exports.deleteSongFromPlaylist = exports.addSongToPlaylist = exports.deletePlayList = exports.updatePlayList = exports.getSinglePlayList = exports.createPlayList = void 0;
const playlist_model_1 = __importDefault(require("../models/playlist.model"));
const song_model_1 = __importDefault(require("../models/song.model"));
const auth_model_1 = __importDefault(require("../models/auth.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createPlayList = async (req, res, _next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { title, description, songs = [] } = req.body;
        const newPlaylist = await playlist_model_1.default.create({
            user: userId,
            songs,
            title,
            description,
        });
        return res.status(201).json({
            status: 201,
            message: "Playlist added successfully",
            data: newPlaylist,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching the song",
        });
    }
};
exports.createPlayList = createPlayList;
const getSinglePlayList = async (req, res, _next) => {
    try {
        const { id } = req.params;
        const playList = await playlist_model_1.default.findById(id);
        if (!playList) {
            return res
                .status(404)
                .json({ status: 404, message: "Playlist was not found" });
        }
        return res.status(200).json({
            status: 200,
            message: "This is the selected playlist",
            data: playList,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 404,
            message: "An error occurred while fetching the playlist",
        });
    }
};
exports.getSinglePlayList = getSinglePlayList;
const updatePlayList = async (req, res, _next) => {
    try {
        const { id } = req.params;
        const playList = await playlist_model_1.default.findById(id);
        if (playList) {
            const { title, description, songs } = playList;
            playList.title = req.body.title || title;
            playList.description = req.body.description || description;
            playList.songs = req.body.songs || songs;
            const updatedPlaylist = await playList.save();
            return res.status(201).json({
                status: 201,
                message: "Playlist updated successfully",
                data: updatedPlaylist,
            });
        }
    }
    catch (error) {
        res
            .status(401)
            .json({ status: 401, message: "An occurred when updating the playlist" });
    }
};
exports.updatePlayList = updatePlayList;
const deletePlayList = async (req, res, _next) => {
    try {
        const { id } = req.params;
        await playlist_model_1.default.findByIdAndDelete(id);
        res.status(200).json({
            status: 200,
            message: "Playlist deleted successfully",
            data: {},
        });
    }
    catch (error) {
        res
            .status(401)
            .json({ status: 401, message: "An occurred when updating the playlist" });
    }
};
exports.deletePlayList = deletePlayList;
const addSongToPlaylist = async (req, res, _next) => {
    try {
        const { playlistId, songId } = req.params;
        const playList = await playlist_model_1.default.findById(playlistId);
        if (!playList) {
            return res
                .status(404)
                .json({ status: 404, message: "Playlist was not found" });
        }
        const song = await song_model_1.default.findById(songId);
        if (!song) {
            return res
                .status(404)
                .json({ status: 404, message: "Song was not found" });
        }
        const songObjectId = new mongoose_1.default.Types.ObjectId(songId);
        if (playList.songs.includes(songObjectId)) {
            return res
                .status(200)
                .json({ status: 200, message: "Song already exist in the playlist" });
        }
        playList.songs.push(songObjectId);
        await playList.save();
        return res.status(201).json({
            status: 201,
            message: "Song added to playlist successfully",
            data: playList,
        });
    }
    catch (error) {
        return res.status(401).json({
            status: 401,
            message: "An error occurred while adding the song to the playlist",
        });
    }
};
exports.addSongToPlaylist = addSongToPlaylist;
const deleteSongFromPlaylist = async (req, res, _next) => {
    try {
        const { playlistId, songId } = req.params;
        const playList = await playlist_model_1.default.findById(playlistId);
        const song = await song_model_1.default.findById(songId);
        const songObjectId = new mongoose_1.default.Types.ObjectId(songId);
        if (!playList) {
            return res
                .status(404)
                .json({ status: 404, message: "Playlist not found" });
        }
        const songIndex = playList.songs.findIndex((song) => song.toString() === songId);
        if (songIndex === -1) {
            return res
                .status(404)
                .json({ status: 404, message: "Song is not in the playlist" });
        }
        playList.songs.splice(songIndex, 1);
        await playList.save();
        return res.status(200).json({
            status: 200,
            message: "Song removed from playlist successfully",
            data: playList,
        });
    }
    catch (error) {
        return res.status(401).json({
            status: 401,
            message: "An error occurred while adding the song to the playlist",
        });
    }
};
exports.deleteSongFromPlaylist = deleteSongFromPlaylist;
const getAllPlaylist = async (req, res, _next) => {
    try {
        const playList = await playlist_model_1.default.find();
        if (!playList) {
            return res
                .status(404)
                .json({ status: 404, message: "No playlist found" });
        }
        return res
            .status(200)
            .json({ status: 200, message: "Get all playlist", data: playList });
    }
    catch (error) {
        return res.status(401).json({
            status: 401,
            message: "An error occurred while fetching  all playlist",
        });
    }
};
exports.getAllPlaylist = getAllPlaylist;
const getUserProfileAndPlaylists = async (req, res, _next) => {
    try {
        const userId = req.params.id;
        const { page = 0, size = 10 } = req.query;
        const user = await auth_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }
        // console.log(user);
        const playlists = await playlist_model_1.default.find({ user: userId })
            .skip(Number(page) * Number(size))
            .limit(Number(size));
        // console.log(playlists);
        return res.status(200).json({
            status: 200,
            message: "Retrieved user profile and playlists successfully",
            data: {
                name: user.name,
                playlists: playlists.map((playlist) => (Object.assign({}, playlist.toObject()))),
            },
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching user profile and playlists",
            error: error.message,
        });
    }
};
exports.getUserProfileAndPlaylists = getUserProfileAndPlaylists;
