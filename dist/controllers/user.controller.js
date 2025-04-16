"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowedArtiste = exports.getArtiste = exports.followArtiste = exports.updateUserProfile = exports.loggedInUser = void 0;
const auth_model_1 = __importDefault(require("../models/auth.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const song_model_1 = __importDefault(require("../models/song.model"));
const loggedInUser = async (req, res, next) => {
    var _a;
    const userData = await auth_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).select("-password");
    if (userData) {
        res.status(200).json({
            status: 200,
            message: "Retrieved a current logged in profile successfully",
            data: userData,
        });
    }
    else {
        res.status(401).json({ status: 401, message: "User data not found" });
    }
};
exports.loggedInUser = loggedInUser;
const updateUserProfile = async (req, res, _next) => {
    var _a;
    const user = await auth_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    if (user) {
        const { name, email, phoneNumber, accountType, address, interestedTags, favoriteGenres, } = user;
        user.name = req.body.name || name;
        user.email = req.body.email || email;
        user.phoneNumber = req.body.phoneNumber || phoneNumber;
        user.accountType = req.body.accountType || accountType;
        user.address = req.body.address || address;
        user.interestedTags = req.body.interestedTags || interestedTags;
        user.favoriteGenres = req.body.favoriteGenres || favoriteGenres;
        const updatedUser = await (user === null || user === void 0 ? void 0 : user.save());
        res.status(200).json({
            status: 200,
            message: "User profile edited successfully",
            data: updatedUser,
        });
    }
    else {
        res.status(401).json({ status: 401, message: "User not found" });
    }
};
exports.updateUserProfile = updateUserProfile;
const followArtiste = async (req, res, next) => {
    var _a;
    try {
        const { artisteId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const artiste = await auth_model_1.default.findById(artisteId);
        const user = await auth_model_1.default.findById(userId);
        if (!user) {
            return res.status(401).json({ status: 401, message: "User not found" });
        }
        if ((artiste === null || artiste === void 0 ? void 0 : artiste.accountType) !== "artiste") {
            return res
                .status(401)
                .json({ status: 401, message: "This user is not an artiste" });
        }
        const artisteObjectId = new mongoose_1.default.Types.ObjectId(artisteId);
        if (user === null || user === void 0 ? void 0 : user.following.includes(artisteObjectId)) {
            return res.status(400).json({
                status: 400,
                message: "You are already following this artiste",
            });
        }
        user === null || user === void 0 ? void 0 : user.following.push(artisteObjectId);
        artiste === null || artiste === void 0 ? void 0 : artiste.followers.push(user === null || user === void 0 ? void 0 : user.id);
        await user.save();
        await artiste.save();
        return res
            .status(200)
            .json({ status: 200, message: `You just followed ${artiste.name}` });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while following the user",
        });
    }
};
exports.followArtiste = followArtiste;
const getArtiste = async (req, res, _next) => {
    try {
        const { artisteId } = req.params;
        const artiste = await auth_model_1.default.findById(artisteId).select("-password");
        if (!artiste) {
            return res.status(404).json({
                status: 404,
                message: "Artiste does not exist",
            });
        }
        return res.status(200).json({
            status: 200,
            message: `Retrieve ${artiste.name} data successfully`,
            data: artiste,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching artiste data",
        });
    }
};
exports.getArtiste = getArtiste;
const getFollowedArtiste = async (req, res, _next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const user = await auth_model_1.default.findById(userId).populate("following", null, "users");
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
            });
        }
        const page = parseInt(req.query.page, 10) || 0;
        const size = parseInt(req.query.size, 10) || 10;
        const followedArtist = user.following;
        const paginatedArtiste = followedArtist.slice(page * size, page * size + size);
        const artistWithSongs = [];
        for (const artist of paginatedArtiste) {
            const songs = await song_model_1.default.find({ artist: artist._id }).select("title description year tags genre createdAt");
            const artistObjectId = new mongoose_1.default.Types.ObjectId(artist);
            // console.log("artistObjectId: ", artistObjectId);
            const artiste = await auth_model_1.default.findById(artistObjectId);
            // console.log("artiste: ", artiste);
            artistWithSongs.push({
                name: artiste === null || artiste === void 0 ? void 0 : artiste.name,
                songs: songs.map((song) => ({
                    title: song.title,
                    description: song.description,
                    year: song.year,
                    tags: song.tags,
                    genre: song.genre,
                })),
            });
        }
        return res.status(200).json({
            status: 200,
            message: "These are the artiste you are following",
            data: artistWithSongs,
        });
    }
    catch (error) {
        // console.log(error.message);
        return res.status(500).json({
            status: 500,
            message: "An error occurred while fetching artiste data",
        });
    }
};
exports.getFollowedArtiste = getFollowedArtiste;
