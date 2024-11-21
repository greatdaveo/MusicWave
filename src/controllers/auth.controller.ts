import { Request, Response, NextFunction } from "express";
import UserModel, { IAuthModel } from "../models/auth.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string);
};

export const registerUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const {
    name,
    email,
    password,
    phoneNumber,
    accountType,
    address,
    interestedTags,
    favoriteGenres,
    following,
    followers,
  } = req.body;

  if (!name || !email || !password || !accountType) {
    res
      .status(400)
      .json({ status: 400, message: "Please enter all required field" });
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ status: 400, message: "Password must be at least 6 characters" });
  }

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    res
      .status(400)
      .json({ status: 400, message: "This user exist, kindly login" });
  }

  const newUser = await UserModel.create({
    name,
    email,
    password,
    phoneNumber,
    accountType,
    address,
    interestedTags,
    favoriteGenres,
    following,
    followers,
  });

  const token = generateToken(newUser._id as string);

  if (newUser) {
    const {
      _id,
      name,
      email,
      password,
      phoneNumber,
      accountType,
      address,
      interestedTags,
      favoriteGenres,
      following,
      followers,
    } = newUser;
    res.cookie("access_token", token, { path: "/", httpOnly: true });

    res.json({
      status: 201,
      message: "User registered Successfully",
      data: {
        _id,
        token,
        name,
        email,
        password,
        phoneNumber,
        accountType,
        address,
        interestedTags,
        favoriteGenres,
        following,
        followers,
      },
    });
  } else {
    res.status(400).json({ status: 400, message: "Invalid Data" });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ status: 400, message: "Please enter email and password" });
  }

  const userExist = await UserModel.findOne({ email });

  if (userExist) {
    const correctPassword = await bcrypt.compare(password, userExist.password);

    if (!correctPassword) {
      res.status(400).json({ status: 400, message: "Password is incorrect" });
    }

    const token = generateToken(userExist._id as string);

    if (userExist && correctPassword) {
      const user = await UserModel.findOne({ email }).select("-password");
      res.cookie("access_token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400),
      });

      res.status(201).json({
        status: 200,
        message: "Login successfully",
        data: { token, user },
      });
    } else {
      res
        .status(400)
        .json({ status: 400, message: "Invalid email or password" });
    }
  } else {
    res.status(401).json({
      status: 401,
      message: "This user doesn't exist, please register",
    });
  }
};

export const logoutUser = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res
    .cookie("access_token", "", {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
    })
    .json({ status: 200, message: "Logout successful" });
};
