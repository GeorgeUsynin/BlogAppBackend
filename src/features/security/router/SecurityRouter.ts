import { Router } from 'express';
import { ROUTES } from '../../../constants';
import * as RequestHandler from '../requestHandlers';
import { authRefreshTokenMiddleware } from '../../shared/middlewares';

export const SecurityRouter = Router();

const SecurityController = {
    getAllAuthDeviceSessions: RequestHandler.getAllAuthDeviceSessionsHandler,
    terminateAllAuthDeviceSessions: RequestHandler.terminateAllAuthDeviceSessionsHandler,
    terminateDeviceSessionByID: RequestHandler.terminateDeviceSessionByIDHandler,
};

SecurityRouter.get(ROUTES.DEVICES, authRefreshTokenMiddleware, SecurityController.getAllAuthDeviceSessions);
SecurityRouter.delete(ROUTES.DEVICES, authRefreshTokenMiddleware, SecurityController.terminateAllAuthDeviceSessions);
SecurityRouter.delete(
    `${ROUTES.DEVICES}/:id`,
    authRefreshTokenMiddleware,
    SecurityController.terminateDeviceSessionByID
);
