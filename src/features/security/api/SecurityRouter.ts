import { Router } from 'express';
import { ROUTES } from '../../../constants';
import { authRefreshTokenMiddleware } from '../../shared/api/APIMiddlewares';
import { container } from '../compositionRoot';
import { SecurityController } from './securityController';

const securityController = container.get(SecurityController);

export const SecurityRouter = Router();

SecurityRouter.get(
    ROUTES.DEVICES,
    authRefreshTokenMiddleware,
    securityController.getAllAuthDeviceSessions.bind(securityController)
);
SecurityRouter.delete(
    ROUTES.DEVICES,
    authRefreshTokenMiddleware,
    securityController.terminateAllAuthDeviceSessions.bind(securityController)
);
SecurityRouter.delete(
    `${ROUTES.DEVICES}/:id`,
    authRefreshTokenMiddleware,
    securityController.terminateDeviceSessionByID.bind(securityController)
);
