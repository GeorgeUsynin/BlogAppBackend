import { NextFunction, Response } from 'express';
import { RequestWithParams, RequestWithParamsAndBody } from '../../shared/types';
import { CommentItemViewModel, CreateUpdateCommentInputModel, URIParamsCommentIDModel } from '../models';
import { HTTP_STATUS_CODES } from '../../../constants';
import { QueryCommentsRepository } from '../repository';
import { CommentsService } from '../domain';

export class CommentsController {
    constructor(private commentsService: CommentsService, private queryCommentsRepository: QueryCommentsRepository) {}

    async getCommentByID(
        req: RequestWithParams<URIParamsCommentIDModel>,
        res: Response<CommentItemViewModel>,
        next: NextFunction
    ) {
        try {
            const commentId = req.params.id;

            const comment = await this.queryCommentsRepository.getCommentById(commentId);

            res.status(HTTP_STATUS_CODES.OK_200).send(comment);
        } catch (err) {
            next(err);
        }
    }

    async updateCommentByID(
        req: RequestWithParamsAndBody<URIParamsCommentIDModel, CreateUpdateCommentInputModel>,
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
}
