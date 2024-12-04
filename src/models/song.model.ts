import mongoose, { Document, Schema } from "mongoose";

export interface ISongModel extends Document {
  artist: mongoose.Schema.Types.ObjectId;
  title: string;
  year: number;
  duration: number;
  tags?: [string];
  description?: string;
  genre?: string;
  filePath: string;
}

const SongSchema: Schema<ISongModel> = new Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    title: {
      type: String,
    },

    year: {
      type: Number,
      default: new Date().getFullYear(),
    },

    duration: {
      type: Number,
      required: [true, "Please provide song duration"],
      default: 0,
      validate: {
        validator: (value: number) => value > 0,
        message: "The duration must be a positive number",
      },
    },

    tags: { type: [String] },

    description: { type: String },

    genre: { type: String },

    filePath: { type: String },
  },

  { timestamps: true }
);

export default mongoose.model<ISongModel>("songs", SongSchema);
