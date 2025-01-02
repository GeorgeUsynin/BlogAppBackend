import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import { QueryPostsRepository } from '../../posts/repository';
import {
    BlogItemViewModel,
    BlogsPaginatedViewModel,
    CreateUpdateBlogInputModel,
    QueryParamsBlogModel,
    URIParamsBlogIDModel,
} from '../models';
import {
    CreateUpdatePostInputModel,
    PostItemViewModel,
    PostsPaginatedViewModel,
    QueryParamsPostModel,
} from '../../posts/models';
import type {
    RequestWithBody,
    RequestWithQueryParams,
    RequestWithParamsAndQueries,
    RequestWithParamsAndBody,
} from '../../shared/types';
import { BlogsService } from '../domain';
import { QueryBlogsRepository } from '../repository';
import { PostsService } from '../../posts/domain';

export class BlogsController {
    constructor(
        private blogsService: BlogsService,
        private queryBlogsRepository: QueryBlogsRepository,
        private postsService: PostsService,
        private queryPostsRepository: QueryPostsRepository
    ) {}

    async getAllBlogs(
        req: RequestWithQueryParams<QueryParamsBlogModel>,
        res: Response<BlogsPaginatedViewModel>,
        next: NextFunction
    ) {
        try {
            const queryParams = req.query;

            const allBlogs = await this.queryBlogsRepository.getAllBlogs(queryParams);

            res.status(HTTP_STATUS_CODES.OK_200).send(allBlogs);
        } catch (err) {
            next(err);
        }
    }

    async getAllPostsByBlogID(
        req: RequestWithParamsAndQueries<URIParamsBlogIDModel, QueryParamsPostModel>,
        res: Response<PostsPaginatedViewModel>,
        next: NextFunction
    ) {
        try {
            const blogId = req.params.id;
            const queryParams = req.query;

            const allPosts = await this.queryPostsRepository.getAllPostsByBlogId(queryParams, blogId);

            res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
        } catch (err) {
            next(err);
        }
    }

    async getBlogByID(req: Request<URIParamsBlogIDModel>, res: Response<BlogItemViewModel>, next: NextFunction) {
        try {
            const blogId = req.params.id;

            const foundBlog = await this.queryBlogsRepository.getBlogById(blogId);

            res.status(HTTP_STATUS_CODES.OK_200).send(foundBlog);
        } catch (err) {
            next(err);
        }
    }

    async createBlog(
        req: RequestWithBody<CreateUpdateBlogInputModel>,
        res: Response<BlogItemViewModel>,
        next: NextFunction
    ) {
        try {
            const payload = req.body;

            const { id } = await this.blogsService.createBlog(payload);

            const newBlog = await this.queryBlogsRepository.getBlogById(id);

            res.status(HTTP_STATUS_CODES.CREATED_201).send(newBlog);
        } catch (err) {
            next(err);
        }
    }

    async updateBlogByID(
        req: RequestWithParamsAndBody<URIParamsBlogIDModel, CreateUpdateBlogInputModel>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const blogId = req.params.id;
            const payload = req.body;

            await this.blogsService.updateBlog(blogId, payload);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async deleteBlogByID(req: Request<URIParamsBlogIDModel>, res: Response, next: NextFunction) {
        try {
            const blogId = req.params.id;

            await this.blogsService.deleteBlogById(blogId);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async createPostsByBlogID(
        req: RequestWithParamsAndBody<URIParamsBlogIDModel, CreateUpdatePostInputModel>,
        res: Response<PostItemViewModel>,
        next: NextFunction
    ) {
        try {
            const blogId = req.params.id;
            const payload = req.body;

            const { id } = await this.postsService.createPostByBlogId(payload, blogId);

            const newPost = await this.queryPostsRepository.getPostById(id);

            res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
        } catch (err) {
            next(err);
        }
    }
}
