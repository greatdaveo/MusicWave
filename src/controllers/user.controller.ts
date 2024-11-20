import { Request, Response, NextFunction } from "express";
import UserModel, { IAuthModel } from "../models/auth.model";
import mongoose from "mongoose";

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
    const { name, email, phoneNumber, accountType, address } = user;
    user.name = req.body.name || name;
    user.email = req.body.email || email;
    user.phoneNumber = req.body.phoneNumber || phoneNumber;
    user.accountType = req.body.accountType || accountType;
    user.address = req.body.address || address;

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
    const { artistId } = req.params;
    const userId = req.user?._id;

    const artiste = await UserModel.findById(artistId);
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    if (artiste?.accountType !== "artiste") {
      return res
        .status(401)
        .json({ status: 401, message: "This user is not an artiste" });
    }

    const artistObjectId = new mongoose.Types.ObjectId(
      artistId
    ) as unknown as mongoose.Types.ObjectId;

    if (user?.following.includes(artistObjectId)) {
      return res.status(400).json({
        status: 400,
        message: "You are already following this artiste",
      });
    }

    user?.following.push(artistObjectId);
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
