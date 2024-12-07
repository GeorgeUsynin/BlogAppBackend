import { Router } from 'express';
import { checkSchema } from 'express-validator';
import * as RequestHandler from '../requestHandlers';
import { authBearerMiddleware, errorMiddleware } from '../../shared/middlewares';
import { createUpdateCommentValidationSchema } from '../validation';

export const CommentsRouter = Router();

const updateCommentsByIDValidators = [
    authBearerMiddleware,
    checkSchema(createUpdateCommentValidationSchema, ['body']),
    errorMiddleware,
];

const CommentsController = {
    getCommentByID: RequestHandler.getCommentByIDHandler,
    updateCommentByID: RequestHandler.updateCommentByIDHandler,
    deleteCommentByID: RequestHandler.deleteCommentByIDHandler,
};

CommentsRouter.get('/:id', CommentsController.getCommentByID);
CommentsRouter.put('/:id', ...updateCommentsByIDValidators, CommentsController.updateCommentByID);
CommentsRouter.delete('/:id', authBearerMiddleware, CommentsController.deleteCommentByID);
