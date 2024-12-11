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
        id: notification.id,
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

export const pushNotification = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const { title, message, isRead } = req.body;

    if (!title || !message || isRead) {
      return res.status(400).json({
        status: 400,
        message: "Please fill all notification fields",
      });
    }

    // const notificationData = {
    //   userId,
    //   title: "Push Notification Activated",
    //   message:
    //     "Your push notification feature has been successfully activated.",
    //   isRead: false,
    // };

    const newNotification = await NotificationModel.create({
      user: userId,
      title,
      message,
      isRead,
    });

    return res.status(201).json({
      status: 201,
      message: "Push notification activated successfully",
      data: newNotification,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while activating the push notification",
    });
  }
};

export const clearNotifications = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    await NotificationModel.deleteMany({ userId });

    return res.status(200).json({
      status: 200,
      message: "Notifications deleted successfully",
      data: {},
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 500,
      message: "An error occurred while clearing notifications",
    });
  }
};
