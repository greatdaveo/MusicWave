import * as express from 'express';
import { IAuthModel } from './models/auth.model';

declare global {
    namespace Express {
        interface Request {
            user?: IAuthModel;
        }
    }
}
