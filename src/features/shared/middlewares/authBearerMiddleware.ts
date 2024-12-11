import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { authService } from '../services';
import { ResultStatus } from '../../../constants';

export const authBearerMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const { data, status } = await authService.verifyBearerAuthorization(authorizationHeader);

    if (!data) {
        if (status === ResultStatus.Unauthorized) {
            res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
            return;
        } else {
            res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
            return;
        }
    }

    req.userId = data.userId;

    next();
};
