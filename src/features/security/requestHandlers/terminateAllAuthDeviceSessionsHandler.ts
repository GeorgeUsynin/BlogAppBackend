import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { authDeviceSessionsService } from '../domain';

export const terminateAllAuthDeviceSessionsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const usedId = req.userId as string;

        await authDeviceSessionsService.terminateAllUserDeviceSessions(usedId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
