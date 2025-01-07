import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../../../../constants';
import { JWTService } from '../../../shared/application/services';
import { container } from '../../../users/api/compositionRoot';
import { UsersService } from '../../../users/application';
import { authDeviceSessionsService } from '../../../security/router/compositionRoot';
import { ErrorViewModel } from '../../types';

const usersService = container.get(UsersService);
const jwtService = new JWTService();

export const authRefreshTokenMiddleware = async (req: Request, res: Response<ErrorViewModel>, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const decoded = await jwtService.parseJWTToken(refreshToken);

    if (!decoded) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const isUserExists = Boolean(await usersService.findUserById(decoded.userId));

    if (!isUserExists) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const authDeviceSession = await authDeviceSessionsService.findDeviceById(decoded.deviceId);

    if (!authDeviceSession) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    const isRefreshTokenVersionValid =
        new Date(Number(decoded.iat) * 1000).toISOString() === authDeviceSession.issuedAt;

    if (!isRefreshTokenVersionValid) {
        res.sendStatus(HTTP_STATUS_CODES.UNAUTHORIZED_401);
        return;
    }

    req.userId = decoded.userId;
    req.deviceId = decoded.deviceId;

    next();
};
