import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { JWTService } from '../services';
import { usersService } from '../../users/domain';
import { ErrorViewModel } from '../types';

export const authRefreshTokenMiddleware = async (req: Request, res: Response<ErrorViewModel>, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const decoded = await JWTService.parseJWTToken(refreshToken);

    if (!decoded) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const isUserExists = Boolean(await usersService.findUserById(decoded.userId));

    if (!isUserExists) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const isRefreshTokenAlreadyBeenUsed = await usersService.checkRefreshTokenAlreadyBeenUsed(
        decoded.userId,
        refreshToken
    );

    if (isRefreshTokenAlreadyBeenUsed) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED_401).send({
            errorsMessages: [{ field: '', message: 'Token already been used' }],
        });
        return;
    }

    req.userId = decoded.userId;

    next();
};
