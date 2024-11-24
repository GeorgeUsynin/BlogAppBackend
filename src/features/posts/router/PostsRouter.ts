import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdatePostValidationSchema } from '../validation';
import * as RequestHandler from '../requestHandlers';
import { authMiddleware, errorMiddleware } from '../../shared/middlewares';

export const PostsRouter = Router();

const commonValidators = [authMiddleware, checkSchema(createUpdatePostValidationSchema, ['body']), errorMiddleware];

const PostsController = {
    getAllPosts: RequestHandler.getAllPostsHandler,
    getPostByID: RequestHandler.getPostByIDHandler,
    createPost: RequestHandler.createPostHandler,
    updatePostByID: RequestHandler.updatePostByIDHandler,
    deletePostByID: RequestHandler.deletePostByID,
};

PostsRouter.get('/', PostsController.getAllPosts);
PostsRouter.get('/:id', PostsController.getPostByID);
PostsRouter.post('/', ...commonValidators, PostsController.createPost);
PostsRouter.put('/:id', ...commonValidators, PostsController.updatePostByID);
PostsRouter.delete('/:id', authMiddleware, PostsController.deletePostByID);
