import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAuthModel extends Document {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  accountType: string;
  address: {
    country: string;
    state: string;
    countryCode: string;
  };
  interestedTags: string[];
  favoriteGenres: string[];
  following: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<IAuthModel> = new Schema(
  {
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

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },

  { timestamps: true }
);

// To Encrypt Password before saving to the DB
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  } else {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
  }
});

export default mongoose.model<IAuthModel>("users", UserSchema);
