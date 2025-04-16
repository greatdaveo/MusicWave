"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/current", auth_middleware_1.protectedRoute, user_controller_1.loggedInUser);
router.put("/current", auth_middleware_1.protectedRoute, user_controller_1.updateUserProfile);
exports.default = router;
