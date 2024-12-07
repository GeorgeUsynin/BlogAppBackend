import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { authService } from '../../auth/domain';

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const isMatched = authService.verifyBasicAuthorization(authorizationHeader);

    isMatched ? next() : res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
};
