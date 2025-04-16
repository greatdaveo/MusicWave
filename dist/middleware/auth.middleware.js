"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginStatus = exports.artisteOnly = exports.protectedRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_model_1 = __importDefault(require("../models/auth.model"));
const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (token) {
            res.setHeader("Authorization", `Bearer ${token}`);
        }
        else {
            return res
                .status(400)
                .json({ status: 400, message: "User is not logged in" });
        }
        const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!verifiedToken) {
            res.status(401);
            logging.error("Unauthorized - No token provided");
        }
        const userData = await auth_model_1.default.findById(verifiedToken.id).select("-password");
        if (!userData) {
            return res.status(401).json({ status: 401, message: "User not found" });
        }
        req.user = userData;
        next();
    }
    catch (error) {
        logging.log("ProtectedRoute Middleware Error: ", error.message);
        res
            .status(401)
            .json({ status: 401, message: "Not Authorized, please login" });
    }
};
exports.protectedRoute = protectedRoute;
const artisteOnly = (req, res, next) => {
    if (req.user && req.user.accountType === "artiste") {
        next();
    }
    else {
        return res
            .status(401)
            .json({ status: 401, message: "Sorry, only artiste is authorized" });
    }
};
exports.artisteOnly = artisteOnly;
const userLoginStatus = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(400).json({ status: 400, message: "No Token" });
    }
    const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const userData = await auth_model_1.default.findById(verifiedToken.id).select("-password");
    if (!userData) {
        res.status(401).json({ status: 401, message: "User not found" });
    }
    req.user = userData;
    if (verifiedToken) {
        res.status(200).json({
            status: 200,
            message: "Retrieved a current logged in profile successfully",
        });
    }
    else {
        res.json(false);
    }
};
exports.userLoginStatus = userLoginStatus;
