import mongoose, { Schema, Document } from "mongoose";

export interface IPlayBack extends Document {
  user: mongoose.Schema.Types.ObjectId;
  song: mongoose.Schema.Types.ObjectId;
  currentState: number;
  isCompleted: boolean;
}

const PlayBackSchema: Schema<IPlayBack> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    song: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "songs",
      required: true,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    currentState: {
      type: Number,
      default: 0,
      min: 0,
    },
  },

  { timestamps: true }
);

export default mongoose.model<IPlayBack>("playback", PlayBackSchema);
