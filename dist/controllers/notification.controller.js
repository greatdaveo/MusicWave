"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationReadStatus = exports.clearNotifications = exports.pushNotification = exports.getNotification = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const getNotification = async (req, res, _next) => {
    try {
        const notificationId = req.params.id;
        const notification = await notification_model_1.default.findById(notificationId);
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
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while retrieving the notification",
        });
    }
};
exports.getNotification = getNotification;
const pushNotification = async (req, res, _next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        const newNotification = await notification_model_1.default.create({
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
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while activating the push notification",
        });
    }
};
exports.pushNotification = pushNotification;
const clearNotifications = async (req, res, _next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        await notification_model_1.default.deleteMany({ userId });
        return res.status(200).json({
            status: 200,
            message: "Notifications deleted successfully",
            data: {},
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while clearing notifications",
        });
    }
};
exports.clearNotifications = clearNotifications;
const notificationReadStatus = async (req, res, _next) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { id } = req.params;
        const { isRead } = req.body;
        if (typeof isRead !== "boolean") {
            return res.status(400).json({
                status: 400,
                message: "'isRead' field must be a boolean",
            });
        }
        const notification = await notification_model_1.default.findByIdAndUpdate(id, { isRead }, { new: true });
        if (!notification) {
            return res.status(404).json({
                status: 404,
                message: "Notification not found",
            });
        }
        return res.status(201).json({
            status: 201,
            message: "Notification successfully marked",
            data: notification,
        });
    }
    catch (error) {
        return res.status(500).json({
            status: 500,
            message: "An error occurred while updating the notification",
        });
    }
};
exports.notificationReadStatus = notificationReadStatus;
