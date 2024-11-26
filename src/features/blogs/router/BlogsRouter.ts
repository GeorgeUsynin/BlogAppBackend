import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdateBlogValidationSchema } from '../validation';
import * as RequestHandler from '../requestHandlers';
import { authMiddleware, errorMiddleware } from '../../shared/middlewares';
import { getQueryParamsBlogAndPostValidationSchema } from '../../shared/validation';
import { createUpdatePostValidationSchema } from '../../posts/validation';
import { ROUTES } from '../../../constants';

export const BlogsRouter = Router();

const createUpdateBlogValidators = [
    authMiddleware,
    checkSchema(createUpdateBlogValidationSchema, ['body']),
    errorMiddleware,
];

const createUpdatePostValidators = [
    authMiddleware,
    checkSchema(createUpdatePostValidationSchema, ['body']),
    errorMiddleware,
];

const getAllBlogsValidators = [
    checkSchema(getQueryParamsBlogAndPostValidationSchema('blogs'), ['query']),
    errorMiddleware,
];

const getAllPostsValidators = [
    checkSchema(getQueryParamsBlogAndPostValidationSchema('posts'), ['query']),
    errorMiddleware,
];

const BlogsController = {
    getAllBlogs: RequestHandler.getAllBlogsHandler,
    getAllPostsByBlogID: RequestHandler.getAllPostsByBlogIDHandler,
    getBlogByID: RequestHandler.getBlogByIDHandler,
    createBlog: RequestHandler.createBlogHandler,
    updateBlogByID: RequestHandler.updateBlogByIDHandler,
    deleteBlogByID: RequestHandler.deleteBlogByIDHandler,
    createPostsByBlogID: RequestHandler.createPostsByBlogIDHandler,
};

BlogsRouter.get('/', ...getAllBlogsValidators, BlogsController.getAllBlogs);
BlogsRouter.get('/:id', BlogsController.getBlogByID);
BlogsRouter.get(`/:blogId${ROUTES.POSTS}`, ...getAllPostsValidators, BlogsController.getAllPostsByBlogID);
BlogsRouter.post('/', ...createUpdateBlogValidators, BlogsController.createBlog);
BlogsRouter.post(`/:blogId${ROUTES.POSTS}`, ...createUpdatePostValidators, BlogsController.createPostsByBlogID);
BlogsRouter.put('/:id', ...createUpdateBlogValidators, BlogsController.updateBlogByID);
BlogsRouter.delete('/:id', authMiddleware, BlogsController.deleteBlogByID);
