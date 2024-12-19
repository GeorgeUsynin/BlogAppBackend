import { NextFunction, Request, Response } from 'express';
import { RefreshTokenViewModel } from '../models';
import { usersService } from '../../users/domain';
import { HTTP_STATUS_CODES } from '../../../constants';
import { ErrorViewModel } from '../../shared/types';

export const refreshTokenHandler = async (
    req: Request,
    res: Response<RefreshTokenViewModel | ErrorViewModel>,
    next: NextFunction
) => {
    try {
        const userId = req.userId as string;

        const refreshToken = req.cookies.refreshToken;

        const { newAccessToken, newRefreshToken } = await usersService.revokeRefreshToken(userId, refreshToken);

        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

        res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken: newAccessToken });
    } catch (err) {
        next(err);
    }
};
