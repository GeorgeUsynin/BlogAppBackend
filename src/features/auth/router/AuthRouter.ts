import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandler from '../requestHandlers';
import {
    authBearerMiddleware,
    authRefreshTokenMiddleware,
    apiRateLimitMiddleware,
    errorMiddleware,
} from '../../shared/middlewares';
import {
    loginValidationSchema,
    registrationValidationSchema,
    registrationConfirmationValidationSchema,
    registrationEmailResendingValidationSchema,
} from '../validation';
import { ROUTES } from '../../../constants';

export const AuthRouter = Router();

const loginValidators = [apiRateLimitMiddleware, checkSchema(loginValidationSchema, ['body']), errorMiddleware];
const registrationValidators = [
    apiRateLimitMiddleware,
    checkSchema(registrationValidationSchema, ['body']),
    errorMiddleware,
];
const registrationConfirmationValidators = [
    apiRateLimitMiddleware,
    checkSchema(registrationConfirmationValidationSchema, ['body']),
    errorMiddleware,
];
const registrationEmailResendingValidators = [
    apiRateLimitMiddleware,
    checkSchema(registrationEmailResendingValidationSchema, ['body']),
    errorMiddleware,
];

const AuthController = {
    login: RequestHandler.loginHandler,
    logout: RequestHandler.logoutHandler,
    me: RequestHandler.meHandler,
    refreshToken: RequestHandler.refreshTokenHandler,
    registration: RequestHandler.registrationHandler,
    registrationConfirmation: RequestHandler.registrationConfirmationHandler,
    registrationEmailResending: RequestHandler.registrationEmailResendingHandler,
};

AuthRouter.get(ROUTES.ME, authBearerMiddleware, AuthController.me);
AuthRouter.post(ROUTES.LOGIN, ...loginValidators, AuthController.login);
AuthRouter.post(ROUTES.LOGOUT, authRefreshTokenMiddleware, AuthController.logout);
AuthRouter.post(ROUTES.REFRESH_TOKEN, authRefreshTokenMiddleware, AuthController.refreshToken);
AuthRouter.post(ROUTES.REGISTRATION, ...registrationValidators, AuthController.registration);
AuthRouter.post(
    ROUTES.REGISTRATION_CONFIRMATION,
    ...registrationConfirmationValidators,
    AuthController.registrationConfirmation
);
AuthRouter.post(
    ROUTES.REGISTRATION_EMAIL_RESENDING,
    ...registrationEmailResendingValidators,
    AuthController.registrationEmailResending
);
