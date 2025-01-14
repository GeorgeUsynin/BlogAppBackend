import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUpdateBlogValidationSchema } from './validation';
import {
    authBasicMiddleware,
    errorMiddleware,
    getUserIdFromAccessTokenMiddleware,
} from '../../shared/api/APIMiddlewares';
import { queryParamsValidationSchema } from '../../shared/api/validation';
import { createUpdatePostValidationSchema } from '../../posts/api/validation';
import { ROUTES } from '../../../constants';
import { container } from '../../compositionRoot';
import { BlogsController } from './blogsController';

const blogsController = container.get(BlogsController);

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

const getAllPostsValidators = [
    getUserIdFromAccessTokenMiddleware,
    checkSchema(queryParamsValidationSchema('posts'), ['query']),
    errorMiddleware,
];

BlogsRouter.get('/', ...getAllBlogsValidators, blogsController.getAllBlogs.bind(blogsController));
BlogsRouter.get('/:id', blogsController.getBlogByID.bind(blogsController));
BlogsRouter.get(
    `/:id${ROUTES.POSTS}`,
    ...getAllPostsValidators,
    blogsController.getAllPostsByBlogID.bind(blogsController)
);
BlogsRouter.post('/', ...createUpdateBlogValidators, blogsController.createBlog.bind(blogsController));
BlogsRouter.post(
    `/:id${ROUTES.POSTS}`,
    ...createUpdatePostValidators,
    blogsController.createPostsByBlogID.bind(blogsController)
);
BlogsRouter.put('/:id', ...createUpdateBlogValidators, blogsController.updateBlogByID.bind(blogsController));
BlogsRouter.delete('/:id', authBasicMiddleware, blogsController.deleteBlogByID.bind(blogsController));
