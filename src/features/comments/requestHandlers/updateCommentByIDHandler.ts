import { Response } from 'express';
import { RequestWithParamsAndBody } from '../../shared/types';
import { URIParamsCommentIDModel, CreateUpdateCommentInputModel } from '../models';
import { commentsService } from '../domain';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';

export const updateCommentByIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsCommentIDModel, CreateUpdateCommentInputModel>,
    res: Response
) => {
    const commentId = req.params.id;
    const payload = req.body;
    const userId = req.userId;

    const { status } = await commentsService.updateCommentById(commentId, userId as string, payload);

    if (status === ResultStatus.NotFound) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    if (status === ResultStatus.Forbidden) {
        res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN_403);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
