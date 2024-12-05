import { Request, Response, NextFunction } from "express";
import UserModel, { IAuthModel } from "../models/auth.model";
import mongoose from "mongoose";
import SongModel from "../models/song.model";

// import jwt, { JwtPayload } from 'jsonwebtoken';

// interface DecodedToken extends JwtPayload {
//     id: string;
// }

declare global {
  namespace Express {
    export interface Request {
      user?: IAuthModel;
    }
  }
}

export const loggedInUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userData = await UserModel.findById(req.user?._id).select("-password");

  if (userData) {
    res.status(200).json({
      status: 200,
      message: "Retrieved a current logged in profile successfully",
      data: userData,
    });
  } else {
    res.status(401).json({ status: 401, message: "User data not found" });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const user = await UserModel.findById(req.user?._id);

  if (user) {
    const {
      name,
      email,
      phoneNumber,
      accountType,
      address,
      interestedTags,
      favoriteGenres,
    } = user;
    user.name = req.body.name || name;
    user.email = req.body.email || email;
    user.phoneNumber = req.body.phoneNumber || phoneNumber;
    user.accountType = req.body.accountType || accountType;
    user.address = req.body.address || address;
    user.interestedTags = req.body.interestedTags || interestedTags;
    user.favoriteGenres = req.body.favoriteGenres || favoriteGenres;

    const updatedUser = await user?.save();

    res.status(200).json({
      status: 200,
      message: "User profile edited successfully",
      data: updatedUser,
    });
  } else {
    res.status(401).json({ status: 401, message: "User not found" });
  }
};

export const followArtiste = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { artisteId } = req.params;
    const userId = req.user?._id;

    const artiste = await UserModel.findById(artisteId);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    if (artiste?.accountType !== "artiste") {
      return res
        .status(401)
        .json({ status: 401, message: "This user is not an artiste" });
    }

    const artisteObjectId = new mongoose.Types.ObjectId(
      artisteId
    ) as unknown as mongoose.Types.ObjectId;

    if (user?.following.includes(artisteObjectId)) {
      return res.status(400).json({
        status: 400,
        message: "You are already following this artiste",
      });
    }

    user?.following.push(artisteObjectId);
    artiste?.followers.push(user?.id);

    await user.save();
    await artiste.save();

    return res
      .status(200)
      .json({ status: 200, message: `You just followed ${artiste.name}` });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while following the user",
    });
  }
};

export const getArtiste = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const { artisteId } = req.params;
    const artiste = await UserModel.findById(artisteId).select("-password");

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
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching artiste data",
    });
  }
};

export const getFollowedArtiste = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const userId = req.user?._id;

    const user = await UserModel.findById(userId).populate(
      "following",
      null,
      "users"
    );

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const page = parseInt(req.query.page as string, 10) || 0;
    const size = parseInt(req.query.size as string, 10) || 10;

    const followedArtist = user.following;
    const paginatedArtiste = followedArtist.slice(
      page * size,
      page * size + size
    );

    const artistWithSongs = [];
    for (const artist of paginatedArtiste) {
      const songs = await SongModel.find({ artist: artist._id }).select(
        "title description year tags genre createdAt"
      );

      const artistObjectId = new mongoose.Types.ObjectId(artist);
      // console.log("artistObjectId: ", artistObjectId);
      const artiste = await UserModel.findById(artistObjectId);
      // console.log("artiste: ", artiste);

      artistWithSongs.push({
        name: artiste?.name,
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
  } catch (error: any) {
    // console.log(error.message);
    return res.status(500).json({
      status: 500,
      message: "An error occurred while fetching artiste data",
    });
  }
};
