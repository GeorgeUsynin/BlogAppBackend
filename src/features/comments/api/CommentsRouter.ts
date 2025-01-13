import { Router } from 'express';
import { checkSchema } from 'express-validator';
import {
    authBearerMiddleware,
    errorMiddleware,
    getUserIdFromAccessTokenMiddleware,
} from '../../shared/api/APIMiddlewares';
import { createUpdateCommentValidationSchema } from './validation';
import { updateLikeStatusValidationSchema } from '../../likes/api/validation';
import { ROUTES } from '../../../constants';
import { container } from '../../compositionRoot';
import { CommentsController } from './commentsController';

const commentsController = container.get(CommentsController);

export const CommentsRouter = Router();

const updateCommentsByIDValidators = [
    authBearerMiddleware,
    checkSchema(createUpdateCommentValidationSchema, ['body']),
    errorMiddleware,
];

const updateLikeStatusValidators = [
    authBearerMiddleware,
    checkSchema(updateLikeStatusValidationSchema, ['body']),
    errorMiddleware,
];

CommentsRouter.get(
    '/:id',
    getUserIdFromAccessTokenMiddleware,
    commentsController.getCommentByID.bind(commentsController)
);
CommentsRouter.put(
    '/:id',
    ...updateCommentsByIDValidators,
    commentsController.updateCommentByID.bind(commentsController)
);
CommentsRouter.delete('/:id', authBearerMiddleware, commentsController.deleteCommentByID.bind(commentsController));
CommentsRouter.put(
    `/:id${ROUTES.LIKE_STATUS}`,
    ...updateLikeStatusValidators,
    commentsController.updateLikeStatusByCommentID.bind(commentsController)
);
