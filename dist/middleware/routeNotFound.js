"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeNotFound = routeNotFound;
function routeNotFound(_req, res, _next) {
    const error = new Error('Not found');
    logging.warning(error);
    res.status(404).json({
        error: {
            message: error.message
        }
    });
}
