import { NextFunction, Request, Response } from 'express';
import { RefreshTokenViewModel } from '../models';
import { authService } from '../../auth/domain';
import { HTTP_STATUS_CODES } from '../../../constants';
import { ErrorViewModel } from '../../shared/types';

export const refreshTokenHandler = async (
    req: Request,
    res: Response<RefreshTokenViewModel | ErrorViewModel>,
    next: NextFunction
) => {
    try {
        const userId = req.userId as string;
        const deviceId = req.deviceId as string;

        const { newAccessToken, newRefreshToken } = await authService.updateTokens(userId, deviceId);

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

        res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken: newAccessToken });
    } catch (err) {
        next(err);
    }
};
