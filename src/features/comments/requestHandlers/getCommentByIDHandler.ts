import { Response } from 'express';
import { RequestWithParams } from '../../shared/types';
import { CommentItemViewModel, URIParamsCommentIDModel } from '../models';
import { queryCommentsRepository } from '../repository';
import { HTTP_STATUS_CODES } from '../../../constants';

export const getCommentByIDHandler = async (
    req: RequestWithParams<URIParamsCommentIDModel>,
    res: Response<CommentItemViewModel>
) => {
    const commentId = req.params.id;

    const comment = await queryCommentsRepository.getCommentById(commentId);

    if (!comment) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.status(HTTP_STATUS_CODES.OK_200).send(comment);
};
