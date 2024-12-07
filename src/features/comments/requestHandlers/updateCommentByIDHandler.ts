import { Response } from 'express';
import { RequestWithParamsAndBody } from '../../shared/types';
import { URIParamsCommentIDModel, CreateUpdateCommentInputModel } from '../models';
import { commentsService } from '../domain';
import { HTTP_STATUS_CODES } from '../../../constants';

export const updateCommentByIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsCommentIDModel, CreateUpdateCommentInputModel>,
    res: Response
) => {
    const commentId = req.params.id;
    const payload = req.body;
    const userId = req.userId;

    const comment = await commentsService.updateCommentById(commentId, userId as string, payload);

    if (!comment) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    if ('statusCode' in comment) {
        res.sendStatus(comment.statusCode);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
