import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdatePostValidationSchema, blogIdValidationSchema } from './validation';
import { createUpdateCommentValidationSchema } from '../../comments/api/validation';
import {
    authBasicMiddleware,
    authBearerMiddleware,
    errorMiddleware,
    getUserIdFromAccessTokenMiddleware,
} from '../../shared/api/APIMiddlewares';
import { queryParamsValidationSchema } from '../../shared/api/validation';
import { ROUTES } from '../../../constants';
import { container } from '../../compositionRoot';
import { PostsController } from './postsController';
import { updateLikeStatusValidationSchema } from '../../likes/api';

const postsController = container.get(PostsController);

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
const getAllPostsValidators = [
    getUserIdFromAccessTokenMiddleware,
    checkSchema(queryParamsValidationSchema('posts'), ['query']),
    errorMiddleware,
];
const getAllCommentsByPostID = [
    getUserIdFromAccessTokenMiddleware,
    checkSchema(queryParamsValidationSchema('comments'), ['query']),
    errorMiddleware,
];
const updateLikeStatusValidators = [
    authBearerMiddleware,
    checkSchema(updateLikeStatusValidationSchema, ['body']),
    errorMiddleware,
];

PostsRouter.get('/', ...getAllPostsValidators, postsController.getAllPosts.bind(postsController));
PostsRouter.get('/:id', getUserIdFromAccessTokenMiddleware, postsController.getPostByID.bind(postsController));
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
PostsRouter.put(
    `/:id${ROUTES.LIKE_STATUS}`,
    ...updateLikeStatusValidators,
    postsController.updateLikeStatusByPostID.bind(postsController)
);
