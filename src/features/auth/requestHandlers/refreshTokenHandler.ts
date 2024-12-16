import { Request, Response } from 'express';
import { RefreshTokenViewModel } from '../models';
import { usersService } from '../../users/domain';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';
import { ErrorViewModel } from '../../shared/types';

export const refreshTokenHandler = async (req: Request, res: Response<RefreshTokenViewModel | ErrorViewModel>) => {
    const userId = req.userId as string;

    const revokedRefreshToken = req.cookies.refreshToken;

    const { data, status, errorsMessages } = await usersService.revokeRefreshToken(userId, revokedRefreshToken);

    if (!data) {
        if (status === ResultStatus.Failure && errorsMessages) {
            res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500).send({ errorsMessages });
        } else {
            res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        }
        return;
    }

    const { accessToken, refreshToken } = data;

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    res.status(HTTP_STATUS_CODES.OK_200).send({ accessToken });
};
