import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { authDeviceSessionsService } from '../domain';

export const terminateAllAuthDeviceSessionsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deviceId = req.deviceId as string;
        const usedId = req.userId as string;

        await authDeviceSessionsService.terminateAllOtherUserDeviceSessions(usedId, deviceId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
