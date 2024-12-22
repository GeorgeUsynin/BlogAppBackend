import { NextFunction, Request, Response } from 'express';
import { authDeviceSessionsQueryRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../../constants';
import { AuthDeviceViewModel } from '../models';

export const getAllAuthDeviceSessionsHandler = async (
    req: Request,
    res: Response<AuthDeviceViewModel[]>,
    next: NextFunction
) => {
    try {
        const usedId = req.userId as string;

        const allUserDeviceSessions = await authDeviceSessionsQueryRepository.getAllUserAuthDeviceSessions(usedId);

        res.status(HTTP_STATUS_CODES.OK_200).send(allUserDeviceSessions);
    } catch (err) {
        next(err);
    }
};
