import { NextFunction, Request, Response } from "express";
import NotificationModel from "../models/notification.model";

export const getNotification = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const notificationId = req.params.id;
    const notification = await NotificationModel.findById(notificationId);

    if (!notification) {
      return res.status(404).json({
        status: 404,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Retrieve notification successfully",
      data: {
        user: notification.user,
        title: notification.title,
        message: notification.message,
        isRead: notification.isRead,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while retrieving the notification",
    });
  }
};
