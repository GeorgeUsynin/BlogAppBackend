import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdateBlogValidationSchema } from '../validation';
import * as RequestHandler from '../requestHandlers';
import { authMiddleware, errorMiddleware } from '../../shared/middlewares';
import { queryParamsBlogPostValidationSchema } from '../../shared/validation';
import { ROUTES } from '../../../constants';

export const BlogsRouter = Router();

const createUpdateBlogValidators = [
    authMiddleware,
    checkSchema(createUpdateBlogValidationSchema, ['body']),
    errorMiddleware,
];

const getAllBlogsValidators = [checkSchema(queryParamsBlogPostValidationSchema, ['query']), errorMiddleware];

const BlogsController = {
    getAllBlogs: RequestHandler.getAllBlogsHandler,
    getAllPostsByBlogID: RequestHandler.getAllPostsByBlogIDHandler,
    getBlogByID: RequestHandler.getBlogByIDHandler,
    createBlog: RequestHandler.createBlogHandler,
    updateBlogByID: RequestHandler.updateBlogByIDHandler,
    deleteBlogByID: RequestHandler.deleteBlogByID,
};

BlogsRouter.get('/', ...getAllBlogsValidators, BlogsController.getAllBlogs);
BlogsRouter.get('/:id', BlogsController.getBlogByID);
BlogsRouter.get(`/:id/${ROUTES.POSTS}`, BlogsController.getAllPostsByBlogID);
BlogsRouter.post('/', ...createUpdateBlogValidators, BlogsController.createBlog);
BlogsRouter.put('/:id', ...createUpdateBlogValidators, BlogsController.updateBlogByID);
BlogsRouter.delete('/:id', authMiddleware, BlogsController.deleteBlogByID);
