import { Request, Response, NextFunction } from "express";
import SongModel from "../models/song.model";
import PlaybackModel from "../models/playback.model";
import UserModel from "../models/auth.model";
import { Multer } from "multer";
import mongoose from "mongoose";
import playbackModel from "../models/playback.model";
import { title } from "process";

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
    }
  }
}

export const uploadSongs = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { title, description, duration, year, tags, genre } = req.body;
    const artistId = req.user?.id;
    const musicFile = req?.file;

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

    const artist = await UserModel.findById(artistId);
    if (!artist || artist?.accountType !== "artiste") {
      return res.status(403).json({
        status: 403,
        message: "Only artiste accounts can upload songs.",
      });
    }

    const existingSong = await SongModel.findOne({
      songs: musicFile.filename,
    });

    if (existingSong) {
      return res.status(400).json({
        status: 400,
        message: "You have uploaded this song before.",
      });
    }

    const newSong = await SongModel.create({
      title,
      description,
      duration,
      year,
      tags,
      genre,
      artist: artistId,
      songs: musicFile.filename,
    });

    const songObjectId = new mongoose.Types.ObjectId(newSong.id);

    if (artist?.songs?.includes(songObjectId)) {
      return res
        .status(400)
        .json({ status: 400, message: "You have uploaded this song before" });
    }

    artist?.songs?.push(songObjectId);
    await artist.save();

    res.status(201).json({
      status: 201,
      message: "Song uploaded successfully.",
      data: newSong,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 500,
      message: "An error occurred while uploading the song.",
    });
  }
};

export const getSongs = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { page = 0, size = 10, filter, sortBy, search } = req.query;

    let query: any = {};

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

    let sortOptions: any = {};
    // To Sort
    if (typeof sortBy === "string") {
      const sortField = sortBy.toLowerCase();
      sortOptions[sortField] = 1;
    } else {
      sortOptions.title = 1;
    }

    // For Pagination
    const skip = Number(page) * Number(size);
    const limit = Number(size);

    // To query the DB
    const songs = await SongModel.find(query)
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
  } catch (error: any) {
    logging.error(error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while retrieving songs",
    });
  }
};

export const getSingleSong = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ status: 400, message: "Please provide song id" });
    }

    const song = await SongModel.findById(id);
    if (!song) {
      return res
        .status(404)
        .json({ status: 404, message: "This song was not found" });
    } else {
      return res.status(200).json({
        status: 400,
        message: "Received a single song successfully",
        data: song,
      });
    }
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching the song",
    });
  }
};

export const PlayBackState = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const { state } = req.body;

    if (!id || state === undefined) {
      return res.status(400).json({
        status: 400,
        message: "Please provide song ID and play back state",
      });
    }

    const song = await SongModel.findById(id);
    let playBack = await PlaybackModel.findOne({ user: userId, song: id });

    if (song) {
      let isCompleted = state >= song?.duration;

      if (playBack) {
        playBack.currentState = state;
        playBack.isCompleted = isCompleted;
        await playBack.save();
      } else {
        playBack = new PlaybackModel({
          user: userId,
          song: id,
          currentState: state,
          isCompleted,
        });

        await playBack.save();
      }
    } else {
      return res
        .status(404)
        .json({ status: 404, message: "This song was not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Song playback record saved successfully",
      data: playBack,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching the song",
    });
  }
};

export const songRecommendation = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { page = 0, size = 10 } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const recommendedSongs = await SongModel.findOne({
      $or: [
        { tags: { $in: user?.interestedTags } },
        { genre: { $in: user?.favoriteGenres } },
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
  } catch (error: any) {
    // console.log(error.message);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching recommended songs",
    });
  }
};

export const getLatestSongs = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { page = 0, size = 10 } = req.query;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const songs = await SongModel.find({
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
  } catch (error: any) {
    console.error("Error fetching new releases:", error);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching new releases",
    });
  }
};

export const getRecentlyPlayedSongs = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { page = 0, size = 10 } = req.query;

    if (!userId) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized: User not found",
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const recentSongs = await playbackModel
      .find({ user: userId })
      .populate("song")
      .sort({ updatedAt: -1 })
      .skip(Number(page) * Number(size))
      .limit(Number(size));

    console.log(recentSongs);

    const transformedSongs = recentSongs.map((playback: any) => ({
      title: playback.song?.title,
      year: playback.song?.year,
      description: playback.song.description,
      duration: playback.song.duration,
      tags: playback.song.tags,
      genre: playback.song.genre,
    }));

    return res.status(200).json({
      status: 200,
      message: "Retrieved all 'Recent' songs successfully",
      data: transformedSongs,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching recently played songs",
      error: error.message,
    });
  }
};
