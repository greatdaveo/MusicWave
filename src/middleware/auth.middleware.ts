import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel, { IAuthModel } from "../models/auth.model";
import { Request, Response, NextFunction } from "express";

interface DecodedToken extends JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    export interface Request {
      user?: IAuthModel | undefined;
    }
  }
}

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.access_token;

    if (token) {
      res.setHeader("Authorization", `Bearer ${token}`);
    } else {
      return res
        .status(400)
        .json({ status: 400, message: "User is not logged in" });
    }

    const verifiedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    if (!verifiedToken) {
      res.status(401);
      logging.error("Unauthorized - No token provided");
    }

    const userData = await UserModel.findById(verifiedToken.id).select(
      "-password"
    );
    if (!userData) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    req.user = userData as IAuthModel;

    next();
  } catch (error) {
    logging.log("ProtectedRoute Middleware Error: ", (error as Error).message);
    res
      .status(401)
      .json({ status: 401, message: "Not Authorized, please login" });
  }
};

export const artisteOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.accountType === "artiste") {
    next();
  } else {
    return res
      .status(401)
      .json({ status: 401, message: "Sorry, only artiste is authorized" });
  }
};

export const userLoginStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(400).json({ status: 400, message: "No Token" });
  }

  const verifiedToken = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as DecodedToken;

  const userData = await UserModel.findById(verifiedToken.id).select(
    "-password"
  );
  if (!userData) {
    res.status(401).json({ status: 401, message: "User not found" });
  }

  req.user = userData as IAuthModel;

  if (verifiedToken) {
    res.status(200).json({
      status: 200,
      message: "Retrieved a current logged in profile successfully",
    });
  } else {
    res.json(false);
  }
};
