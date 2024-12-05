import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdatePostValidationSchema, blogIdValidationSchema } from '../validation';
import { createUpdateCommentValidationSchema } from '../../comments/validation';
import * as RequestHandler from '../requestHandlers';
import { authMiddleware, authBearerMiddleware, errorMiddleware } from '../../shared/middlewares';
import { queryParamsValidationSchema } from '../../shared/validation';
import { ROUTES } from '../../../constants';

export const PostsRouter = Router();

const createUpdateValidators = [
    authMiddleware,
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
const getAllCommentsByPostID = [checkSchema(queryParamsValidationSchema('comments'), ['query']), errorMiddleware];

const PostsController = {
    getAllPosts: RequestHandler.getAllPostsHandler,
    getPostByID: RequestHandler.getPostByIDHandler,
    getAllCommentsByPostID: RequestHandler.getAllCommentsByPostIDHandler,
    createPost: RequestHandler.createPostHandler,
    createCommentByPostID: RequestHandler.createCommentByPostIDHandler,
    updatePostByID: RequestHandler.updatePostByIDHandler,
    deletePostByID: RequestHandler.deletePostByIDHandler,
};

PostsRouter.get('/', ...getAllPostsValidators, PostsController.getAllPosts);
PostsRouter.get('/:id', PostsController.getPostByID);
PostsRouter.get(`/:id${ROUTES.COMMENTS}`, ...getAllCommentsByPostID, PostsController.getAllCommentsByPostID);
PostsRouter.post('/', ...createUpdateValidators, PostsController.createPost);
PostsRouter.post(`/:id${ROUTES.COMMENTS}`, ...createCommentValidators, PostsController.createCommentByPostID);
PostsRouter.put('/:id', ...createUpdateValidators, PostsController.updatePostByID);
PostsRouter.delete('/:id', authMiddleware, PostsController.deletePostByID);
