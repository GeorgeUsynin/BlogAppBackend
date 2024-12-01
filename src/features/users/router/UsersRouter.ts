import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandler from '../requestHandlers';
import { authMiddleware, errorMiddleware } from '../../shared/middlewares';
import { queryParamsValidationSchema } from '../../shared/validation';
import { createUserValidationSchema } from '../validation';

export const UsersRouter = Router();

const createUserValidators = [authMiddleware, checkSchema(createUserValidationSchema, ['body']), errorMiddleware];

const getAllUsersValidators = [
    authMiddleware,
    checkSchema(queryParamsValidationSchema('users'), ['query']),
    errorMiddleware,
];

const UsersController = {
    getAllUsers: RequestHandler.getAllUsersHandler,
    createUser: RequestHandler.createUserHandler,
    deleteUserByID: RequestHandler.deleteUserByIDHandler,
};

UsersRouter.get('/', ...getAllUsersValidators, UsersController.getAllUsers);
UsersRouter.post('/', ...createUserValidators, UsersController.createUser);
UsersRouter.delete('/:id', authMiddleware, UsersController.deleteUserByID);
