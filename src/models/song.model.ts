import mongoose, { Document, Schema } from "mongoose";
import express from "express";

export interface ISongModel extends Document {
  title: string;
  year?: number;
  tags?: [string];
  description?: string;
  genre?: string;
}

const SongSchema: Schema<ISongModel> = new Schema(
  {
    title: {
      type: String,
    },

    year: {
      type: Number,
      default: new Date().getFullYear(),
    },

    tags: { type: [String] },

    description: { type: String },

    genre: { type: String },
  },

  { timestamps: true }
);

export default mongoose.model<ISongModel>("songs", SongSchema);
