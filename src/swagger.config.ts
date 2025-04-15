import swaggerJSdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MusicWave API",
      version: "1.0.0",
      description:
        "MusicWave is a backend API that powers a music streaming experience. Users can stream songs, create playlists, follow artists, and more.",
    },
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
  apis: ["src/docs/**/*.ts"],
};

const swaggerSpec = swaggerJSdoc(options);

export const setupSwaggerDocs = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`📘 Swagger Docs running at http://localhost:3000/api-docs`);
};
