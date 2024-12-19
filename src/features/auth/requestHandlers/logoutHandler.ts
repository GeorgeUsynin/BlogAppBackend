import { NextFunction, Request, Response } from 'express';
import { usersService } from '../../users/domain';
import { HTTP_STATUS_CODES } from '../../../constants';
import { ErrorViewModel } from '../../shared/types';

export const logoutHandler = async (req: Request, res: Response<ErrorViewModel>, next: NextFunction) => {
    try {
        const userId = req.userId as string;

        const refreshToken = req.cookies.refreshToken;

        await usersService.logout(userId, refreshToken);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
