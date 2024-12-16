import { Request, Response } from 'express';
import { usersService } from '../../users/domain';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';
import { ErrorViewModel } from '../../shared/types';

export const logoutHandler = async (req: Request, res: Response<ErrorViewModel>) => {
    const userId = req.userId as string;

    const revokedRefreshToken = req.cookies.refreshToken;

    const { errorsMessages, status } = await usersService.logout(userId, revokedRefreshToken);

    if (status === ResultStatus.Failure && errorsMessages) {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500).send({ errorsMessages });
        return;
    } else if (status === ResultStatus.Success) {
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
};
