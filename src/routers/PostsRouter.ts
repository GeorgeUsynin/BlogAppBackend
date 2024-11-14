import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdatePostValidationSchema } from './validators';
import * as RequestHandler from './postRequestHandlers';
import { authHandler, errorHandler } from './sharedHandlers';

export const PostsRouter = Router();

const commonValidators = [authHandler, checkSchema(createUpdatePostValidationSchema, ['body']), errorHandler];

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
PostsRouter.delete('/:id', authHandler, PostsController.deletePostByID);
