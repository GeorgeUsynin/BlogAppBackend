import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { authBearerMiddleware, errorMiddleware } from '../../shared/middlewares';
import { createUpdateCommentValidationSchema } from '../validation';
import { commentsController } from './compositionRoot';

export const CommentsRouter = Router();

const updateCommentsByIDValidators = [
    authBearerMiddleware,
    checkSchema(createUpdateCommentValidationSchema, ['body']),
    errorMiddleware,
];

CommentsRouter.get('/:id', commentsController.getCommentByID.bind(commentsController));
CommentsRouter.put(
    '/:id',
    ...updateCommentsByIDValidators,
    commentsController.updateCommentByID.bind(commentsController)
);
CommentsRouter.delete('/:id', authBearerMiddleware, commentsController.deleteCommentByID.bind(commentsController));
