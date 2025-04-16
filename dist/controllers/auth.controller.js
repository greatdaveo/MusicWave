"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const auth_model_1 = __importDefault(require("../models/auth.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET);
};
const registerUser = async (req, res, _next) => {
    const { name, email, password, phoneNumber, accountType, address, interestedTags, favoriteGenres, likes, following, followers, } = req.body;
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
    const existingUser = await auth_model_1.default.findOne({ email });
    if (existingUser) {
        res
            .status(400)
            .json({ status: 400, message: "This user exist, kindly login" });
    }
    const newUser = await auth_model_1.default.create({
        name,
        email,
        password,
        phoneNumber,
        accountType,
        address,
        interestedTags,
        favoriteGenres,
        likes,
        following,
        followers,
    });
    const token = generateToken(newUser._id);
    if (newUser) {
        const { _id, name, email, password, phoneNumber, accountType, address, interestedTags, favoriteGenres, likes, following, followers, } = newUser;
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
                likes,
                following,
                followers,
            },
        });
    }
    else {
        res.status(400).json({ status: 400, message: "Invalid Data" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, _next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res
            .status(400)
            .json({ status: 400, message: "Please enter email and password" });
    }
    const userExist = await auth_model_1.default.findOne({ email });
    if (userExist) {
        const correctPassword = await bcryptjs_1.default.compare(password, userExist.password);
        if (!correctPassword) {
            res.status(400).json({ status: 400, message: "Password is incorrect" });
        }
        const token = generateToken(userExist._id);
        if (userExist && correctPassword) {
            const user = await auth_model_1.default.findOne({ email }).select("-password");
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
        }
        else {
            res
                .status(400)
                .json({ status: 400, message: "Invalid email or password" });
        }
    }
    else {
        res.status(401).json({
            status: 401,
            message: "This user doesn't exist, please register",
        });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (_req, res, _next) => {
    res
        .cookie("access_token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
    })
        .json({ status: 200, message: "Logout successful" });
};
exports.logoutUser = logoutUser;
