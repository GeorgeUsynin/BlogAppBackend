import { Response } from 'express';
import { RequestWithParams } from '../../shared/types';
import { URIParamsCommentIDModel } from '../models';
import { commentsService } from '../domain';
import { HTTP_STATUS_CODES, ResultStatus } from '../../../constants';

export const deleteCommentByIDHandler = async (req: RequestWithParams<URIParamsCommentIDModel>, res: Response) => {
    const commentId = req.params.id;
    const userId = req.userId;

    const { status } = await commentsService.deleteCommentById(commentId, userId as string);

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
