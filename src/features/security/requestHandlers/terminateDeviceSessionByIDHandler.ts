import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { authDeviceSessionsService } from '../domain';
import { URIParamsDeviceIDModel } from '../models';
import { RequestWithParams } from '../../shared/types';

export const terminateDeviceSessionByIDHandler = async (
    req: RequestWithParams<URIParamsDeviceIDModel>,
    res: Response,
    next: NextFunction
) => {
    try {
        const deviceId = req.params.id;
        const userId = req.userId as string;

        await authDeviceSessionsService.terminateDeviceSessionByIDHandler(userId, deviceId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
