import { Router } from 'express';
import { checkSchema } from 'express-validator';
import {
    authBearerMiddleware,
    authRefreshTokenMiddleware,
    apiRateLimitMiddleware,
    errorMiddleware,
} from '../../shared/api/APIMiddlewares';
import {
    loginValidationSchema,
    registrationValidationSchema,
    registrationConfirmationValidationSchema,
    registrationEmailResendingValidationSchema,
    passwordRecoveryValidationSchema,
    newPasswordValidationSchema,
} from '../api/validation';
import { ROUTES } from '../../../constants';
import { container } from '../compositionRoot';
import { AuthController } from './authController';

const authController = container.get(AuthController);

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
const passwordRecoveryValidators = [
    apiRateLimitMiddleware,
    checkSchema(passwordRecoveryValidationSchema, ['body']),
    errorMiddleware,
];
const newPasswordValidators = [
    apiRateLimitMiddleware,
    checkSchema(newPasswordValidationSchema, ['body']),
    errorMiddleware,
];

AuthRouter.get(ROUTES.ME, authBearerMiddleware, authController.me.bind(authController));
AuthRouter.post(ROUTES.LOGIN, ...loginValidators, authController.login.bind(authController));
AuthRouter.post(ROUTES.LOGOUT, authRefreshTokenMiddleware, authController.logout.bind(authController));
AuthRouter.post(ROUTES.REFRESH_TOKEN, authRefreshTokenMiddleware, authController.refreshToken.bind(authController));
AuthRouter.post(ROUTES.REGISTRATION, ...registrationValidators, authController.registration.bind(authController));
AuthRouter.post(
    ROUTES.REGISTRATION_CONFIRMATION,
    ...registrationConfirmationValidators,
    authController.registrationConfirmation.bind(authController)
);
AuthRouter.post(
    ROUTES.REGISTRATION_EMAIL_RESENDING,
    ...registrationEmailResendingValidators,
    authController.registrationEmailResending.bind(authController)
);
AuthRouter.post(
    ROUTES.PASSWORD_RECOVERY,
    ...passwordRecoveryValidators,
    authController.passwordRecovery.bind(authController)
);
AuthRouter.post(ROUTES.NEW_PASSWORD, ...newPasswordValidators, authController.newPassword.bind(authController));
