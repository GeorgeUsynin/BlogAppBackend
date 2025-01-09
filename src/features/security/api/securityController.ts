import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { AuthDeviceSessionsQueryRepository } from '../infrastructure';
import { HTTP_STATUS_CODES } from '../../../constants';
import { AuthDeviceViewModel, URIParamsDeviceIDModel } from './models';
import { AuthDeviceSessionsService } from '../application';
import { RequestWithParams } from '../../shared/types';

export class SecurityController {
    constructor(
        @inject(AuthDeviceSessionsService) private authDeviceSessionsService: AuthDeviceSessionsService,
        @inject(AuthDeviceSessionsQueryRepository)
        private authDeviceSessionsQueryRepository: AuthDeviceSessionsQueryRepository
    ) {}

    async getAllAuthDeviceSessions(req: Request, res: Response<AuthDeviceViewModel[]>, next: NextFunction) {
        try {
            const usedId = req.userId as string;

            const allUserDeviceSessions = await this.authDeviceSessionsQueryRepository.getAllUserAuthDeviceSessions(
                usedId
            );

            res.status(HTTP_STATUS_CODES.OK_200).send(allUserDeviceSessions);
        } catch (err) {
            next(err);
        }
    }

    async terminateAllAuthDeviceSessions(req: Request, res: Response, next: NextFunction) {
        try {
            const deviceId = req.deviceId as string;
            const usedId = req.userId as string;

            await this.authDeviceSessionsService.terminateAllOtherUserDeviceSessions(usedId, deviceId);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async terminateDeviceSessionByID(
        req: RequestWithParams<URIParamsDeviceIDModel>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const deviceId = req.params.id;
            const userId = req.userId as string;

            await this.authDeviceSessionsService.terminateDeviceSessionByIDHandler(userId, deviceId);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }
}
