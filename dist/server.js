"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shutdown = exports.Main = exports.httpServer = exports.app = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
require("./config/logging");
const logging_handler_1 = require("./middleware/logging.handler");
const corsHandler_1 = require("./middleware/corsHandler");
const routeNotFound_1 = require("./middleware/routeNotFound");
const config_1 = require("./config/config");
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const song_route_1 = __importDefault(require("./routes/song.route"));
const playlist_route_1 = __importDefault(require("./routes/playlist.route"));
const artiste_route_1 = __importDefault(require("./routes/artiste.route"));
const notification_route_1 = __importDefault(require("./routes/notification.route"));
// Docs
const swagger_config_1 = require("./swagger.config");
exports.app = (0, express_1.default)();
exports.app.use((0, cookie_parser_1.default)());
mongoose_1.default
    .connect(config_1.server.MongoDB_URL)
    .then(() => {
    logging.info("Connected to MongoDB");
    (0, exports.Main)();
})
    .catch((error) => {
    logging.error("Unable to connect to MongoDB!");
    logging.error(error);
});
const Main = () => {
    logging.info("----------------------------------------");
    logging.info("Initializing API");
    logging.info("----------------------------------------");
    exports.app.use(express_1.default.urlencoded({ extended: true }));
    exports.app.use(express_1.default.json());
    logging.info("----------------------------------------");
    logging.info("Logging & Configuration");
    logging.info("----------------------------------------");
    exports.app.use(logging_handler_1.loggingHandler);
    exports.app.use(corsHandler_1.corsHandler);
    logging.info("----------------------------------------");
    logging.info("Define Controller Routing");
    logging.info("----------------------------------------");
    exports.app.get("/main/healthcheck", (_req, res, _next) => {
        return res.status(200).json({ test: "App Running" });
    });
    // Routes
    exports.app.use("/api/auth", auth_route_1.default);
    exports.app.use("/api/user", user_route_1.default);
    exports.app.use("/api", song_route_1.default);
    exports.app.use("/api", playlist_route_1.default);
    exports.app.use("/api", artiste_route_1.default);
    exports.app.use("/api", notification_route_1.default);
    (0, swagger_config_1.setupSwaggerDocs)(exports.app);
    logging.info("----------------------------------------");
    logging.info("Define Controller Routing");
    logging.info("----------------------------------------");
    exports.app.use(routeNotFound_1.routeNotFound);
    logging.info("----------------------------------------");
    logging.info("Start Server");
    logging.info("----------------------------------------");
    exports.httpServer = http_1.default.createServer(exports.app);
    exports.httpServer.listen(config_1.server.SERVER_PORT, () => {
        logging.info("----------------------------------------");
        logging.info("Server Started" + config_1.server.SERVER_HOSTNAME);
        logging.info("----------------------------------------");
    });
};
exports.Main = Main;
const Shutdown = (callback) => exports.httpServer && exports.httpServer.close(callback);
exports.Shutdown = Shutdown;
