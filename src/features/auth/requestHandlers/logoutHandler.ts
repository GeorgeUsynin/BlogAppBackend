import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { ErrorViewModel } from '../../shared/types';
import { authService } from '../domain';

export const logoutHandler = async (req: Request, res: Response<ErrorViewModel>, next: NextFunction) => {
    try {
        const userId = req.userId as string;
        const deviceId = req.deviceId as string;

        await authService.logout(userId, deviceId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
