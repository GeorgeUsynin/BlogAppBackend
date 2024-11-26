import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdatePostValidationSchema } from '../validation';
import * as RequestHandler from '../requestHandlers';
import { authMiddleware, errorMiddleware } from '../../shared/middlewares';
import { queryParamsBlogAndPostValidationSchema } from '../../shared/validation';

export const PostsRouter = Router();

const createUpdateValidators = [
    authMiddleware,
    checkSchema(createUpdatePostValidationSchema, ['body']),
    errorMiddleware,
];
const getAllPostsValidators = [checkSchema(queryParamsBlogAndPostValidationSchema, ['query']), errorMiddleware];

const PostsController = {
    getAllPosts: RequestHandler.getAllPostsHandler,
    getPostByID: RequestHandler.getPostByIDHandler,
    createPost: RequestHandler.createPostHandler,
    updatePostByID: RequestHandler.updatePostByIDHandler,
    deletePostByID: RequestHandler.deletePostByIDHandler,
};

PostsRouter.get('/', ...getAllPostsValidators, PostsController.getAllPosts);
PostsRouter.get('/:id', PostsController.getPostByID);
PostsRouter.post('/', ...createUpdateValidators, PostsController.createPost);
PostsRouter.put('/:id', ...createUpdateValidators, PostsController.updatePostByID);
PostsRouter.delete('/:id', authMiddleware, PostsController.deletePostByID);
