import { Request, Response, NextFunction } from "express";
import PlaylistModel from "../models/playlist.model";
import songModel from "../models/song.model";
import mongoose from "mongoose";

export const createPlayList = async (
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

export const getSinglePlayList = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;
    const playList = await PlaylistModel.findById(id);
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
  } catch (error: any) {
    return res.status(500).json({
      status: 404,
      message: "An error occurred while fetching the playlist",
    });
  }
};

export const updatePlayList = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;

    const playList = await PlaylistModel.findById(id);

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
  } catch (error) {
    res
      .status(401)
      .json({ status: 401, message: "An occurred when updating the playlist" });
  }
};

export const deletePlayList = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { id } = req.params;
    await PlaylistModel.findByIdAndDelete(id);
    res.status(200).json({
      status: 200,
      message: "Playlist deleted successfully",
      data: {},
    });
  } catch (error) {
    res
      .status(401)
      .json({ status: 401, message: "An occurred when updating the playlist" });
  }
};

export const addSongToPlaylist = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { playlistId, songId } = req.params;
    // const userId = req.user?._id;

    const playList = await PlaylistModel.findById(playlistId);
    if (!playList) {
      return res
        .status(404)
        .json({ status: 404, message: "Playlist was not found" });
    }

    const song = await songModel.findById(songId);
    if (!song) {
      return res
        .status(404)
        .json({ status: 404, message: "Song was not found" });
    }

    const songObjectId = new mongoose.Types.ObjectId(
      songId
    ) as unknown as mongoose.Schema.Types.ObjectId;

    if (playList.songs.includes(songObjectId)) {
      res
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
  } catch (error: any) {
    return res.status(401).json({
      status: 401,
      message: "An error occurred while adding the song to the playlist",
    });
  }
};
