import { NextFunction, Request, Response } from 'express';
import { APIError } from '../helpers';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';

export const APIErrorMiddleware = (err: APIError, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof APIError) {
        const { errorsMessages, status } = err.getError();

        if (status === ResultStatus.BadRequest) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).send({ errorsMessages });
            return;
        }

        if (status === ResultStatus.NotFound) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND_404).send({ errorsMessages });
            return;
        }

        if (status === ResultStatus.Failure) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500).send({ errorsMessages });
            return;
        }
    }

    console.error('Error: ', err);
    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
    return;
};
