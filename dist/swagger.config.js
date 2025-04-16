"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MusicWave API",
            version: "1.0.0",
            description: "MusicWave is a backend API that powers a music streaming experience. Users can stream songs, create playlists, follow artists, and more.",
        },
        servers: [
            {
                url: "https://musicwave.onrender.com",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ["./dist/routes/**/*.js"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwaggerDocs = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    console.log(`📘 Swagger Docs running at https://musicwave.onrender.com/api-docs/`);
};
exports.setupSwaggerDocs = setupSwaggerDocs;
