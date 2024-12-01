import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdatePostValidationSchema, blogIdValidationSchema } from '../validation';
import * as RequestHandler from '../requestHandlers';
import { authMiddleware, errorMiddleware } from '../../shared/middlewares';
import { queryParamsValidationSchema } from '../../shared/validation';

export const PostsRouter = Router();

const createUpdateValidators = [
    authMiddleware,
    checkSchema(createUpdatePostValidationSchema, ['body']),
    checkSchema(blogIdValidationSchema, ['body']),
    errorMiddleware,
];
const getAllPostsValidators = [checkSchema(queryParamsValidationSchema('posts'), ['query']), errorMiddleware];

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
