import { inject } from 'inversify';
import { NextFunction, Response } from 'express';
import { RequestWithParams, RequestWithParamsAndBody } from '../../shared/types';
import { CommentItemViewModel, URIParamsCommentIDModel } from '../api/models';
import { HTTP_STATUS_CODES } from '../../../constants';
import { QueryCommentsRepository } from '../infrastructure';
import { CommentsService } from '../application';
import { CreateUpdateCommentInputDTO } from '../application';
import { LikeStatusInputDTO, LikesService } from '../../likes/application';

export class CommentsController {
    constructor(
        @inject(CommentsService) private commentsService: CommentsService,
        @inject(LikesService) private likesService: LikesService,
        @inject(QueryCommentsRepository) private queryCommentsRepository: QueryCommentsRepository
    ) {}

    async getCommentByID(
        req: RequestWithParams<URIParamsCommentIDModel>,
        res: Response<CommentItemViewModel>,
        next: NextFunction
    ) {
        try {
            const commentId = req.params.id;
            const userId = req.userId;

            const comment = await this.queryCommentsRepository.getCommentById(commentId, userId!);

            res.status(HTTP_STATUS_CODES.OK_200).send(comment);
        } catch (err) {
            next(err);
        }
    }

    async updateCommentByID(
        req: RequestWithParamsAndBody<URIParamsCommentIDModel, CreateUpdateCommentInputDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const commentId = req.params.id;
            const payload = req.body;
            const userId = req.userId;

            await this.commentsService.updateCommentById(commentId, userId as string, payload);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async deleteCommentByID(req: RequestWithParams<URIParamsCommentIDModel>, res: Response, next: NextFunction) {
        try {
            const commentId = req.params.id;
            const userId = req.userId;

            await this.commentsService.deleteCommentById(commentId, userId as string);

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }

    async updateLikeStatusByCommentID(
        req: RequestWithParamsAndBody<URIParamsCommentIDModel, LikeStatusInputDTO>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const commentId = req.params.id;
            const likeStatus = req.body.likeStatus;
            const userId = req.userId;

            await this.likesService.updateLikeStatusByParentID({
                parentId: commentId,
                likeStatus,
                userId: userId as string,
                parentType: 'comment',
            });

            res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
        } catch (err) {
            next(err);
        }
    }
}
