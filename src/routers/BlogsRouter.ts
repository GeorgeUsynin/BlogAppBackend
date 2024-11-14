import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdateBlogValidationSchema } from './validators';
import * as RequestHandler from './blogsRequestHandlers';
import { authHandler, errorHandler } from './sharedHandlers';

export const BlogsRouter = Router();

const commonValidators = [authHandler, checkSchema(createUpdateBlogValidationSchema, ['body']), errorHandler];

const BlogsController = {
    getAllBlogs: RequestHandler.getAllBlogsHandler,
    getBlogByID: RequestHandler.getBlogByIDHandler,
    createBlog: RequestHandler.createBlogHandler,
    updateBlogByID: RequestHandler.updateBlogByIDHandler,
    deleteBlogByID: RequestHandler.deleteBlogByID,
};

BlogsRouter.get('/', BlogsController.getAllBlogs);
BlogsRouter.get('/:id', BlogsController.getBlogByID);
BlogsRouter.post('/', ...commonValidators, BlogsController.createBlog);
BlogsRouter.put('/:id', ...commonValidators, BlogsController.updateBlogByID);
BlogsRouter.delete('/:id', authHandler, BlogsController.deleteBlogByID);
