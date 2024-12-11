import { timeStamp } from "console";
import mongoose, { Document, Schema } from "mongoose";

export interface INotificationModel extends Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
}

const NotificationSchema: Schema<INotificationModel> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export default mongoose.model<INotificationModel>(
  "notifications",
  NotificationSchema
);
