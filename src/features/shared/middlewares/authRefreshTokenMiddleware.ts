import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { JWTService } from '../../shared/services';
import { usersService } from '../../users/domain';
import { authDeviceSessionsService } from '../../security/domain';
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

    const isAuthDeviceSessionExists = Boolean(await authDeviceSessionsService.findDeviceById(decoded.userId));

    if (!isAuthDeviceSessionExists) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    req.userId = decoded.userId;
    req.deviceId = decoded.deviceId;

    next();
};
