import { Response } from 'express';
import { RequestWithParamsAndBody } from '../../shared/types';
import { URIParamsPostIDModel } from '../models';
import { CreateUpdateCommentInputModel, CommentItemViewModel } from '../../comments/models';
import { commentsService } from '../../comments/domain';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';
import { queryCommentsRepository } from '../../comments/repository';

export const createCommentByPostIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsPostIDModel, CreateUpdateCommentInputModel>,
    res: Response<CommentItemViewModel>
) => {
    const postId = req.params.id;
    const payload = req.body;
    const userId = req.userId;

    const { data, status } = await commentsService.createCommentByPostId(payload, postId, userId!);

    if (!data) {
        if (status === ResultStatus.NotFound) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        } else {
            res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        }
        return;
    }

    const newComment = await queryCommentsRepository.getCommentById(data.insertedId.toString());

    if (!newComment) {
        res.sendStatus(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
        return;
    }

    res.status(HTTP_STATUS_CODES.CREATED_201).send(newComment);
};
