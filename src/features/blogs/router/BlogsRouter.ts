import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdateBlogValidationSchema } from '../validation';
import * as RequestHandler from '../requestHandlers';
import { authMiddleware, errorMiddleware } from '../../shared/middlewares';

export const BlogsRouter = Router();

const commonValidators = [authMiddleware, checkSchema(createUpdateBlogValidationSchema, ['body']), errorMiddleware];

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
BlogsRouter.delete('/:id', authMiddleware, BlogsController.deleteBlogByID);
