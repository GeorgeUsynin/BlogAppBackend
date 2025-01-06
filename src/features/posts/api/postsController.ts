import { NextFunction, Request, Response } from 'express';
import type {
    RequestWithBody,
    RequestWithParamsAndBody,
    RequestWithParamsAndQueries,
    RequestWithQueryParams,
} from '../../shared/types';
import { PostItemViewModel, PostsPaginatedViewModel, QueryParamsPostModel, URIParamsPostIDModel } from './models';
import { HTTP_STATUS_CODES } from '../../../constants';
import { QueryPostsRepository } from '../infrastructure';
import {
    CommentItemViewModel,
    CommentsPaginatedViewModel,
    CreateUpdateCommentInputModel,
    QueryParamsCommentModel,
    URIParamsCommentIDModel,
} from '../../comments/models';
import { PostsService } from '../domain';
import { CommentsService } from '../../comments/domain';
import { QueryCommentsRepository } from '../../comments/repository';
import { CreateUpdatePostInputDTO } from '../application';

export class PostsController {
    constructor(
        private postsService: PostsService,
        private commentsService: CommentsService,
        private queryPostsRepository: QueryPostsRepository,
        private queryCommentsRepository: QueryCommentsRepository
    ) {}

    async getAllPosts(
        req: RequestWithQueryParams<QueryParamsPostModel>,
        res: Response<PostsPaginatedViewModel>,
        next: NextFunction
    ) {
        try {
            const queryParams = req.query;
            const allPosts = await this.queryPostsRepository.getAllPosts(queryParams);

            res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
        } catch (err) {
            next(err);
        }
    }

    async getPostByID(req: Request<URIParamsPostIDModel>, res: Response<PostItemViewModel>, next: NextFunction) {
        try {
            const postId = req.params.id;

            const foundPost = await this.queryPostsRepository.getPostById(postId);

            res.send(foundPost);
        } catch (err) {
            next(err);
        }
    }

    async getAllCommentsByPostID(
        req: RequestWithParamsAndQueries<URIParamsCommentIDModel, QueryParamsCommentModel>,
        res: Response<CommentsPaginatedViewModel>,
        next: NextFunction
    ) {
        try {
            const queryParams = req.query;
            const postId = req.params.id;
            const userId = req.userId;

            const result = await this.queryCommentsRepository.getAllCommentsByPostId(
                queryParams,
                postId,
                userId as string
            );

            res.status(HTTP_STATUS_CODES.OK_200).send(result);
        } catch (err) {
            next(err);
        }
    }

    async createPost(
        req: RequestWithBody<CreateUpdatePostInputDTO>,
        res: Response<PostItemViewModel>,
        next: NextFunction
    ) {
        try {
            const payload = req.body;

            const { id } = await this.postsService.createPost(payload);
            const newPost = await this.queryPostsRepository.getPostById(id);

            res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
        } catch (err) {
            next(err);
        }
    }

    async createCommentByPostID(
        req: RequestWithParamsAndBody<URIParamsPostIDModel, CreateUpdateCommentInputModel>,
        res: Response<CommentItemViewModel>,
        next: NextFunction
    ) {
        try {
            const postId = req.params.id;
            const payload = req.body;
            const userId = req.userId;

            const { id } = await this.commentsService.createCommentByPostId(payload, postId, userId!);

            const newComment = await this.queryCommentsRepository.getCommentById(id, userId as string);

            res.status(HTTP_STATUS_CODES.CREATED_201).send(newComment);
        } catch (err) {
            next(err);
        }
    }

    async updatePostByID(
        req: RequestWithParamsAndBody<URIParamsPostIDModel, CreateUpdatePostInputDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const postId = req.params.id;
            const payload = req.body;

            await this.postsService.updatePost(postId, payload);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async deletePostByID(req: Request<URIParamsPostIDModel>, res: Response, next: NextFunction) {
        try {
            const postId = req.params.id;

            await this.postsService.deletePostById(postId);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }
}
