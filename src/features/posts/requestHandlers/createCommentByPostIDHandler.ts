import { NextFunction, Response } from 'express';
import { RequestWithParamsAndBody } from '../../shared/types';
import { URIParamsPostIDModel } from '../models';
import { CreateUpdateCommentInputModel, CommentItemViewModel } from '../../comments/models';
import { commentsService } from '../../comments/domain';
import { HTTP_STATUS_CODES } from '../../../constants';
import { queryCommentsRepository } from '../../comments/repository';

export const createCommentByPostIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsPostIDModel, CreateUpdateCommentInputModel>,
    res: Response<CommentItemViewModel>,
    next: NextFunction
) => {
    try {
        const postId = req.params.id;
        const payload = req.body;
        const userId = req.userId;

        const { insertedId } = await commentsService.createCommentByPostId(payload, postId, userId!);

        const newComment = await queryCommentsRepository.getCommentById(insertedId.toString());

        res.status(HTTP_STATUS_CODES.CREATED_201).send(newComment);
    } catch (err) {
        next(err);
    }
};
