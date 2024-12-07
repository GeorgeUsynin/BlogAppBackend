import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdateBlogValidationSchema } from '../validation';
import * as RequestHandler from '../requestHandlers';
import { authBasicMiddleware, errorMiddleware } from '../../shared/middlewares';
import { queryParamsValidationSchema } from '../../shared/validation';
import { createUpdatePostValidationSchema } from '../../posts/validation';
import { ROUTES } from '../../../constants';

export const BlogsRouter = Router();

const createUpdateBlogValidators = [
    authBasicMiddleware,
    checkSchema(createUpdateBlogValidationSchema, ['body']),
    errorMiddleware,
];

const createUpdatePostValidators = [
    authBasicMiddleware,
    checkSchema(createUpdatePostValidationSchema, ['body']),
    errorMiddleware,
];

const getAllBlogsValidators = [checkSchema(queryParamsValidationSchema('blogs'), ['query']), errorMiddleware];

const getAllPostsValidators = [checkSchema(queryParamsValidationSchema('posts'), ['query']), errorMiddleware];

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
BlogsRouter.get(`/:id${ROUTES.POSTS}`, ...getAllPostsValidators, BlogsController.getAllPostsByBlogID);
BlogsRouter.post('/', ...createUpdateBlogValidators, BlogsController.createBlog);
BlogsRouter.post(`/:id${ROUTES.POSTS}`, ...createUpdatePostValidators, BlogsController.createPostsByBlogID);
BlogsRouter.put('/:id', ...createUpdateBlogValidators, BlogsController.updateBlogByID);
BlogsRouter.delete('/:id', authBasicMiddleware, BlogsController.deleteBlogByID);
