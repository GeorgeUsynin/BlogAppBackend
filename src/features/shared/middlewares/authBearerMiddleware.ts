import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { SETTINGS } from '../../../app-settings';

export const authBearerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    const isMatched = authorizationHeader === `Basic ${SETTINGS.CODE_AUTH_BASE64}`;

    isMatched ? next() : res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
};
