"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
    },
    password: {
        type: String,
        required: [true, "Please enter password"],
    },
    phoneNumber: {
        type: String,
    },
    accountType: {
        type: String,
        required: [true, "Please select your account type"],
        default: "user",
        enum: ["user", "artiste"],
    },
    address: {
        country: {
            type: String,
        },
        countryCode: {
            type: String,
            default: "+234",
        },
        state: {
            type: String,
        },
    },
    interestedTags: [
        {
            type: String,
            default: [],
        },
    ],
    favoriteGenres: [
        {
            type: String,
            default: [],
        },
    ],
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "songs",
            default: [],
        },
    ],
    following: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    followers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    songs: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Song",
            default: undefined,
            validate: {
                validator: function () {
                    return this.accountType === "artiste";
                },
                message: "Only artistes can have songs!",
            },
        },
    ],
}, { timestamps: true });
// To Encrypt Password before saving to the DB
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    else {
        // Hash the password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    }
});
exports.default = mongoose_1.default.model("users", UserSchema);
