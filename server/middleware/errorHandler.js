import { BaseError, ValidationError } from 'sequelize';
import createHttpError from "http-errors";

export const dbErrorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError) {
        const errors = err.errors.map((e) => ({ status: 422, title: e.message }));
        return res.status(422).send(errors);
    }

    if (err instanceof BaseError) {
        next(createHttpError(500, 'Database Error'));
    }
    next(err);
};


export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const status = err.status ?? err.statusCode ?? 500;
    const message = err.message ?? 'Server Error';

    return res.status(status).json({
        status,
        message,
    });
};