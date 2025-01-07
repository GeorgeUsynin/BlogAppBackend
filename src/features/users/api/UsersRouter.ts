import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { authBasicMiddleware, errorMiddleware } from '../../shared/api/APIMiddlewares';
import { queryParamsValidationSchema } from '../../shared/api/validation';
import { createUserValidationSchema } from './validation';
import { container } from './compositionRoot';
import { UsersController } from './usersController';

const usersController = container.get(UsersController);

export const UsersRouter = Router();

const createUserValidators = [authBasicMiddleware, checkSchema(createUserValidationSchema, ['body']), errorMiddleware];

const getAllUsersValidators = [
    authBasicMiddleware,
    checkSchema(queryParamsValidationSchema('users'), ['query']),
    errorMiddleware,
];

UsersRouter.get('/', ...getAllUsersValidators, usersController.getAllUsers.bind(usersController));
UsersRouter.post('/', ...createUserValidators, usersController.createUser.bind(usersController));
UsersRouter.delete('/:id', authBasicMiddleware, usersController.deleteUserByID.bind(usersController));
