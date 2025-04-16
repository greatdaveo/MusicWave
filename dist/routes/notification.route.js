"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const notification_controller_1 = require("../controllers/notification.controller");
const router = express_1.default.Router();
router.get("/notifications/:id", auth_middleware_1.protectedRoute, notification_controller_1.getNotification);
router.post("/notifications", auth_middleware_1.protectedRoute, notification_controller_1.pushNotification);
router.put("/notifications/:id", auth_middleware_1.protectedRoute, notification_controller_1.notificationReadStatus);
router.delete("/notifications", auth_middleware_1.protectedRoute, notification_controller_1.clearNotifications);
exports.default = router;
