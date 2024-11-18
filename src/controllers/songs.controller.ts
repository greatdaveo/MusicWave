import { Request, Response, NextFunction } from "express";
import SongModel from "../models/song.model";
import PlaybackModel from "../models/playback.model";
import PlaylistModel from "../models/playlist.model";

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

export const PlayList = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const userId = req.user?._id;
    const { title, description, songs = [] } = req.body;

    const newPlaylist = await PlaylistModel.create({
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
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching the song",
    });
  }
};
