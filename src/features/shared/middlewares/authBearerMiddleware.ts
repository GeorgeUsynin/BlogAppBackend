import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { authService } from '../../auth/domain';

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const result = await authService.verifyBearerAuthorization(authorizationHeader);

    if (result.statusCode) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    req.userId = result.userId;

    next();
};
