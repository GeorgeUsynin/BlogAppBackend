import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdatePostValidationSchema, blogIdValidationSchema } from '../validation';
import { createUpdateCommentValidationSchema } from '../../comments/validation';
import {
    authBasicMiddleware,
    authBearerMiddleware,
    errorMiddleware,
    getUserIdFromAccessTokenMiddleware,
} from '../../shared/middlewares';
import { queryParamsValidationSchema } from '../../shared/validation';
import { ROUTES } from '../../../constants';
import { postsController } from './compositionRoot';

export const PostsRouter = Router();

const createUpdateValidators = [
    authBasicMiddleware,
    checkSchema(createUpdatePostValidationSchema, ['body']),
    checkSchema(blogIdValidationSchema, ['body']),
    errorMiddleware,
];
const createCommentValidators = [
    authBearerMiddleware,
    checkSchema(createUpdateCommentValidationSchema, ['body']),
    errorMiddleware,
];
const getAllPostsValidators = [checkSchema(queryParamsValidationSchema('posts'), ['query']), errorMiddleware];
const getAllCommentsByPostID = [
    getUserIdFromAccessTokenMiddleware,
    checkSchema(queryParamsValidationSchema('comments'), ['query']),
    errorMiddleware,
];

PostsRouter.get('/', ...getAllPostsValidators, postsController.getAllPosts.bind(postsController));
PostsRouter.get('/:id', postsController.getPostByID.bind(postsController));
PostsRouter.get(
    `/:id${ROUTES.COMMENTS}`,
    ...getAllCommentsByPostID,
    postsController.getAllCommentsByPostID.bind(postsController)
);
PostsRouter.post('/', ...createUpdateValidators, postsController.createPost.bind(postsController));
PostsRouter.post(
    `/:id${ROUTES.COMMENTS}`,
    ...createCommentValidators,
    postsController.createCommentByPostID.bind(postsController)
);
PostsRouter.put('/:id', ...createUpdateValidators, postsController.updatePostByID.bind(postsController));
PostsRouter.delete('/:id', authBasicMiddleware, postsController.deletePostByID.bind(postsController));
