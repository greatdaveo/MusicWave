"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentlyPlayedSongs = exports.getLatestSongs = exports.songRecommendation = exports.PlayBackState = exports.shareSong = exports.getLikedSongs = exports.saveLikedSongs = exports.getSingleSong = exports.getSongs = exports.uploadSongs = void 0;
const song_model_1 = __importDefault(require("../models/song.model"));
const playback_model_1 = __importDefault(require("../models/playback.model"));
const auth_model_1 = __importDefault(require("../models/auth.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const playback_model_2 = __importDefault(require("../models/playback.model"));
const uploadSongs = async (req, res, _next) => {
    var _a, _b, _c;
    try {
        const { title, description, duration, year, tags, genre } = req.body;
        const artistId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const musicFile = req === null || req === void 0 ? void 0 : req.file;
        if (!musicFile) {
            return res
                .status(400)
                .json({ status: 400, message: "Music file is required." });
        }
        if (!title || !description || !duration || !year || !tags || !genre) {
            return res
                .status(400)
                .json({ status: 400, message: "Please fill all fields" });
        }
        const artist = await auth_model_1.default.findById(artistId);
        if (!artist || (artist === null || artist === void 0 ? void 0 : artist.accountType) !== "artiste") {
            return res.status(403).json({
                status: 403,
                message: "Only artiste accounts can upload songs.",
            });
        }
        const existingSong = await song_model_1.default.findOne({
            songs: musicFile.filename,
        });
        if (existingSong) {
            return res.status(400).json({
                status: 400,
                message: "You have uploaded this song before.",
            });
        }
        const newSong = await song_model_1.default.create({
            title,
            description,
            duration,
            year,
            tags,
            genre,
            artist: artistId,
            songs: musicFile.filename,
        });
        const songObjectId = new mongoose_1.default.Types.ObjectId(newSong.id);
        if ((_b = artist === null || artist === void 0 ? void 0 : artist.songs) === null || _b === void 0 ? void 0 : _b.includes(songObjectId)) {
            return res
                .status(400)
                .json({ status: 400, message: "You have uploaded this song before" });
        }
        (_c = artist === null || artist === void 0 ? void 0 : artist.songs) === null || _c === void 0 ? void 0 : _c.push(songObjectId);
        await artist.save();
        res.status(201).json({
            status: 201,
            message: "Song uploaded successfully.",
            data: newSong,
        });
    }
    catch (error) {
        res.status(500).json({
            status: 500,
            message: "An error occurred while uploading the song.",
        });
    }
};
exports.uploadSongs = uploadSongs;
const getSongs = async (req, res, _next) => {
    try {
        const { page = 0, size = 10, filter, sortBy, search } = req.query;
        let query = {};
        // To Search
        if (typeof search === "string") {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }
        // To Filter
        if (typeof filter === "string") {
            const filters = filter.split(",");
            query.genre = { $in: filters };
        }
        let sortOptions = {};
        // To Sort
        if (typeof sortBy === "string") {
            const sortField = sortBy.toLowerCase();
            sortOptions[sortField] = 1;
        }
        else {
            sortOptions.title = 1;
        }
        // For Pagination
        const skip = Number(page) * Number(size);
        const limit = Number(size);
        // To query the DB
        const songs = await song_model_1.default.find(query)
            .skip(skip)
            .limit(limit)
            .sort(sortOptions);
        // console.log("Songs:", songs);
        if (!songs || songs.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "No song found",
            });
        }
        return res.status(200).json({
            status: 200,
            message: "Retrieved all searched song successfully",
            data: songs,
        });
    }
    catch (error) {
        logging.error(error);
        return res.status(500).json({
            status: 500,
            message: "An error occurred while retrieving songs",
        });
    }
};
exports.getSongs = getSongs;
const getSingleSong = async (req, res, _next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ status: 400, message: "Please provide song id" });
        }
        const song = await song_model_1.default.findById(id);
        if (!song) {
            return res
                .status(404)
                .json({ status: 404, message: "This song was not found" });
        }
        else {
            return res.status(200).json({
                status: 400,
                message: "Received a single song successfully",
                data: song,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching the song",
        });
    }
};
exports.getSingleSong = getSingleSong;
const saveLikedSongs = async (req, res, _next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { songId } = req.params;
        const user = await auth_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }
        const song = await song_model_1.default.findById(songId);
        const songObjectId = new mongoose_1.default.Types.ObjectId(song === null || song === void 0 ? void 0 : song.id);
        // console.log(songObjectId);
        const songIndex = user.likes.indexOf(songObjectId);
        // console.log(songIndex);
        if (songIndex > -1) {
            user.likes.splice(songIndex, 1);
            await user.save();
            return res.status(200).json({
                status: 200,
                message: "Song unlike successfully",
            });
        }
        else {
            user.likes.push(songObjectId);
            await user.save();
            return res.status(200).json({
                status: 200,
                message: "Song liked successfully",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while toggling like",
        });
    }
};
exports.saveLikedSongs = saveLikedSongs;
const getLikedSongs = async (req, res, _next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { page = 0, size = 10 } = req.query;
        const user = await auth_model_1.default.findById(userId).populate("likes");
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }
        const likedSongs = user.likes.slice(Number(page) * Number(size), Number(page) + 1 * Number(size));
        // console.log("LikedSongs", likedSongs);
        const fullSongDetails = await song_model_1.default.find({ _id: { $in: likedSongs } });
        // console.log("fullSongDetails", fullSongDetails);
        const eachSongs = fullSongDetails.map((song) => ({
            artist: song.artist,
            title: song.title,
            year: song.year,
            description: song.description,
            tags: song.tags,
            genre: song.genre,
            songs: song.songs,
        }));
        return res.status(200).json({
            status: 200,
            message: "Retrieved all liked songs successfully",
            data: eachSongs,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching liked songs",
        });
    }
};
exports.getLikedSongs = getLikedSongs;
const shareSong = async (req, res, _next) => {
    try {
        const { songId } = req.params;
        const song = await song_model_1.default.findById(songId).populate("artist");
        if (!song) {
            return res.status(404).json({
                status: 404,
                message: "Song not found",
            });
        }
        // console.log(song);
        const shareableLink = `https://musicwave.com/${song.title}/${songId}`;
        return res.status(200).json({
            status: 200,
            message: "Shareable link generated successfully",
            data: Object.assign({ sharable: shareableLink }, song.toObject()),
        });
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 500,
            message: "An error occurred while generating the shareable link",
        });
    }
};
exports.shareSong = shareSong;
const PlayBackState = async (req, res, _next) => {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { state } = req.body;
        if (!id || state === undefined) {
            return res.status(400).json({
                status: 400,
                message: "Please provide song ID and play back state",
            });
        }
        const song = await song_model_1.default.findById(id);
        let playBack = await playback_model_1.default.findOne({ user: userId, song: id });
        if (song) {
            let isCompleted = state >= (song === null || song === void 0 ? void 0 : song.duration);
            if (playBack) {
                playBack.currentState = state;
                playBack.isCompleted = isCompleted;
                await playBack.save();
            }
            else {
                playBack = new playback_model_1.default({
                    user: userId,
                    song: id,
                    currentState: state,
                    isCompleted,
                });
                await playBack.save();
            }
        }
        else {
            return res
                .status(404)
                .json({ status: 404, message: "This song was not found" });
        }
        return res.status(200).json({
            status: 200,
            message: "Song playback record saved successfully",
            data: playBack,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching the song",
        });
    }
};
exports.PlayBackState = PlayBackState;
const songRecommendation = async (req, res, _next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { page = 0, size = 10 } = req.params;
        const user = await auth_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }
        const recommendedSongs = await song_model_1.default.findOne({
            $or: [
                { tags: { $in: user === null || user === void 0 ? void 0 : user.interestedTags } },
                { genre: { $in: user === null || user === void 0 ? void 0 : user.favoriteGenres } },
            ],
        })
            .skip(Number(page) * Number(size))
            .limit(Number(size))
            .exec();
        return res.status(200).json({
            status: 200,
            message: "Recommended songs",
            data: recommendedSongs,
        });
    }
    catch (error) {
        // console.log(error.message);
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching recommended songs",
        });
    }
};
exports.songRecommendation = songRecommendation;
const getLatestSongs = async (req, res, _next) => {
    try {
        const { page = 0, size = 10 } = req.query;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const songs = await song_model_1.default.find({
            createdAt: { $gte: thirtyDaysAgo },
        })
            .sort({ updatedAt: -1 })
            .skip(Number(page) * Number(size))
            .limit(Number(size))
            .exec();
        if (!songs) {
            return res
                .status(404)
                .json({ status: 404, message: "No latest songs found" });
        }
        res.status(200).json({
            status: 200,
            message: "Retrieved all newly released songs",
            data: songs,
        });
    }
    catch (error) {
        console.error("Error fetching new releases:", error);
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching new releases",
        });
    }
};
exports.getLatestSongs = getLatestSongs;
const getRecentlyPlayedSongs = async (req, res, _next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { page = 0, size = 10 } = req.query;
        if (!userId) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized: User not found",
            });
        }
        const user = await auth_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }
        const recentSongs = await playback_model_2.default
            .find({ user: userId })
            .populate("song")
            .sort({ updatedAt: -1 })
            .skip(Number(page) * Number(size))
            .limit(Number(size));
        console.log(recentSongs);
        const transformedSongs = recentSongs.map((playback) => {
            var _a, _b;
            return ({
                title: (_a = playback.song) === null || _a === void 0 ? void 0 : _a.title,
                year: (_b = playback.song) === null || _b === void 0 ? void 0 : _b.year,
                description: playback.song.description,
                duration: playback.song.duration,
                tags: playback.song.tags,
                genre: playback.song.genre,
            });
        });
        return res.status(200).json({
            status: 200,
            message: "Retrieved all 'Recent' songs successfully",
            data: transformedSongs,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching recently played songs",
        });
    }
};
exports.getRecentlyPlayedSongs = getRecentlyPlayedSongs;
