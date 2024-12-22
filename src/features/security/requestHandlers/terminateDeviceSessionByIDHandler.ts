import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { authDeviceSessionsService } from '../domain';

export const terminateDeviceSessionByIDHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId as string;
        const deviceId = req.deviceId as string;

        await authDeviceSessionsService.terminateDeviceSessionByIDHandler(userId, deviceId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
