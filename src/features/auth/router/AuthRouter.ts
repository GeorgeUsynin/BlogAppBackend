import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandler from '../requestHandlers';
import { authBearerMiddleware, errorMiddleware } from '../../shared/middlewares';
import { loginValidationSchema } from '../validation';
import { ROUTES } from '../../../constants';

export const AuthRouter = Router();

const loginValidators = [checkSchema(loginValidationSchema, ['body']), errorMiddleware];

const AuthController = {
    login: RequestHandler.loginHandler,
    me: RequestHandler.meHandler,
};

AuthRouter.get(ROUTES.ME, authBearerMiddleware, AuthController.me);
AuthRouter.post(ROUTES.LOGIN, ...loginValidators, AuthController.login);
