import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { authBasicMiddleware, errorMiddleware } from '../../shared/middlewares';
import { queryParamsValidationSchema } from '../../shared/validation';
import { createUserValidationSchema } from '../validation';
import { usersController } from './compositionRoot';

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
