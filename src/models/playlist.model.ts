import { timeStamp } from "console";
import mongoose, { Schema, Document } from "mongoose";

export interface IPlayList extends Document {
  user: mongoose.Schema.Types.ObjectId;
  songs: mongoose.Schema.Types.ObjectId[];
  title: string;
  description: string;
}

const PlayListSchema: Schema<IPlayList> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "songs",
        required: true,
      },
    ],

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
      required: true,
    },
  },

  { timestamps: true }
);

export default mongoose.model<IPlayList>("playlist", PlayListSchema);
