import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { authService } from '../services';
import { ResultStatus } from '../../../constants';
import { usersService } from '../../users/domain';
import { ErrorViewModel } from '../types';

export const authRefreshTokenMiddleware = async (req: Request, res: Response<ErrorViewModel>, next: NextFunction) => {
    const revokedRefreshToken = req.cookies.refreshToken;

    if (!revokedRefreshToken) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const { data, status } = await authService.parseJWTToken(revokedRefreshToken);

    if (!data) {
        if (status === ResultStatus.Unauthorized) {
            res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
            return;
        } else {
            res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
            return;
        }
    }

    const isRevokedRefreshTokenAlreadyBeenUsed = await usersService.checkRefreshTokenAlreadyBeenUsed(
        data.userId,
        revokedRefreshToken
    );

    if (isRevokedRefreshTokenAlreadyBeenUsed) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED_401).send({
            errorsMessages: [{ field: '', message: 'Token already been used' }],
        });
        return;
    }

    req.userId = data.userId;

    next();
};
