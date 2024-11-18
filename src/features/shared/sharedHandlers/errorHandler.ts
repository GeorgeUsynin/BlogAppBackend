import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HTTP_STATUS_CODES } from '../../../constants';

export const errorHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length) {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).send({
            errorsMessages: errors.map(error => ({
                message: error.msg,
                field: error.type === 'field' ? error.path : '',
            })),
        });
        return;
    }

    next();
};
