import { Response } from 'express';
import { RequestWithParams } from '../../shared/types';
import { CommentItemViewModel, URIParamsCommentIDModel } from '../models';
import { commentsService } from '../domain';
import { HTTP_STATUS_CODES } from '../../../constants';

export const deleteCommentByIDHandler = async (req: RequestWithParams<URIParamsCommentIDModel>, res: Response) => {
    const commentId = req.params.id;
    const userId = req.userId;

    const foundComment = await commentsService.deleteCommentById(commentId, userId as string);

    if (!foundComment) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    if ('statusCode' in foundComment) {
        res.sendStatus(foundComment.statusCode);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
