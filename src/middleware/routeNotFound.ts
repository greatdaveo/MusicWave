import { Request, Response, NextFunction } from 'express';

export function routeNotFound(_req: Request, res: Response, _next: NextFunction) {
    const error = new Error('Not found');
    logging.warning(error);

    res.status(404).json({
        error: {
            message: error.message
        }
    });
}
