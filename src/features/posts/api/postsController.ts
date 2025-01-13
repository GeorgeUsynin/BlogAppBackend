import { inject } from 'inversify';
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
    QueryParamsCommentModel,
    URIParamsCommentIDModel,
} from '../../comments/api/models';
import { PostsService } from '../application';
import { CommentsService } from '../../comments/application';
import { QueryCommentsRepository } from '../../comments/infrastructure';
import { CreateUpdatePostInputDTO } from '../application';
import { CreateUpdateCommentInputDTO } from '../../comments/application';
import { LikesService, LikeStatusInputDTO } from '../../likes/application';

export class PostsController {
    constructor(
        @inject(PostsService) private postsService: PostsService,
        @inject(CommentsService) private commentsService: CommentsService,
        @inject(LikesService) private likesService: LikesService,
        @inject(QueryPostsRepository) private queryPostsRepository: QueryPostsRepository,
        @inject(QueryCommentsRepository) private queryCommentsRepository: QueryCommentsRepository
    ) {}

    async getAllPosts(
        req: RequestWithQueryParams<QueryParamsPostModel>,
        res: Response<PostsPaginatedViewModel>,
        next: NextFunction
    ) {
        try {
            const queryParams = req.query;
            const userId = req.userId;

            const allPosts = await this.queryPostsRepository.getAllPosts(queryParams, userId as string);

            res.status(HTTP_STATUS_CODES.OK_200).send(allPosts);
        } catch (err) {
            next(err);
        }
    }

    async getPostByID(req: Request<URIParamsPostIDModel>, res: Response<PostItemViewModel>, next: NextFunction) {
        try {
            const postId = req.params.id;
            const userId = req.userId;

            const foundPost = await this.queryPostsRepository.getPostById(postId, userId as string);

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
            const newPost = await this.queryPostsRepository.getPostById(id, '');

            res.status(HTTP_STATUS_CODES.CREATED_201).send(newPost);
        } catch (err) {
            next(err);
        }
    }

    async createCommentByPostID(
        req: RequestWithParamsAndBody<URIParamsPostIDModel, CreateUpdateCommentInputDTO>,
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

    async updateLikeStatusByPostID(
        req: RequestWithParamsAndBody<URIParamsPostIDModel, LikeStatusInputDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const postId = req.params.id;
            const likeStatus = req.body.likeStatus;
            const userId = req.userId;

            await this.likesService.updateLikeStatusByPostID(postId, likeStatus, userId as string);

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
