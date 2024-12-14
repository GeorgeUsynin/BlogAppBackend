import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandler from '../requestHandlers';
import { authBearerMiddleware, errorMiddleware } from '../../shared/middlewares';
import {
    loginValidationSchema,
    registrationValidationSchema,
    registrationConfirmationValidationSchema,
    registrationEmailResendingValidationSchema,
} from '../validation';
import { ROUTES } from '../../../constants';

export const AuthRouter = Router();

const loginValidators = [checkSchema(loginValidationSchema, ['body']), errorMiddleware];
const registrationValidators = [checkSchema(registrationValidationSchema, ['body']), errorMiddleware];
const registrationConfirmationValidators = [
    checkSchema(registrationConfirmationValidationSchema, ['body']),
    errorMiddleware,
];
const registrationEmailResendingValidators = [
    checkSchema(registrationEmailResendingValidationSchema, ['body']),
    errorMiddleware,
];

const AuthController = {
    login: RequestHandler.loginHandler,
    me: RequestHandler.meHandler,
    registration: RequestHandler.registrationHandler,
    registrationConfirmation: RequestHandler.registrationConfirmationHandler,
    registrationEmailResending: RequestHandler.registrationEmailResendingHandler,
};

AuthRouter.get(ROUTES.ME, authBearerMiddleware, AuthController.me);
AuthRouter.post(ROUTES.LOGIN, ...loginValidators, AuthController.login);
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
