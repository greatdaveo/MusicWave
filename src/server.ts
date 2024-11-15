import http from 'http';
import express from 'express';
import './config/logging';

import { loggingHandler } from './middleware/logging.handler';
import { corsHandler } from './middleware/corsHandler';
import { routeNotFound } from './middleware/routeNotFound';
import { server } from './config/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import AuthRoute from './routes/auth.route';
import UserRoute from './routes/user.route';

const router = express();
export const app = express();
app.use(cookieParser());
export let httpServer: ReturnType<typeof http.createServer>;

mongoose
    .connect(server.MongoDB_URL)
    .then(() => {
        logging.info('Connected to MongoDB');
        Main();
    })
    .catch((error: any) => {
        logging.error('Unable to connect to MongoDB!');
        logging.error(error);
    });

export const Main = () => {
    logging.info('----------------------------------------');
    logging.info('Initializing API');
    logging.info('----------------------------------------');
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    logging.info('----------------------------------------');
    logging.info('Logging & Configuration');

    logging.info('----------------------------------------');
    app.use(loggingHandler);
    app.use(corsHandler);

    logging.info('----------------------------------------');
    logging.info('Define Controller Routing');
    logging.info('----------------------------------------');
    app.get('/main/healthcheck', (_req, res, _next) => {
        return res.status(200).json({ test: 'App Running' });
    });

    // Routes
    app.use('/api/auth', AuthRoute);
    app.use('/api/users', UserRoute);

    logging.info('----------------------------------------');
    logging.info('Define Controller Routing');
    logging.info('----------------------------------------');
    app.use(routeNotFound);

    logging.info('----------------------------------------');
    logging.info('Start Server');
    logging.info('----------------------------------------');
    httpServer = http.createServer(app);
    httpServer.listen(server.SERVER_PORT, () => {
        logging.info('----------------------------------------');
        logging.info('Server Started' + server.SERVER_HOSTNAME);
        logging.info('----------------------------------------');
    });
};

export const Shutdown = (callback: any) => httpServer && httpServer.close(callback);
