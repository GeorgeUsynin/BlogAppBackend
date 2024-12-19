import { NextFunction, Response } from 'express';
import { RequestWithParams } from '../../shared/types';
import { URIParamsCommentIDModel } from '../models';
import { commentsService } from '../domain';
import { HTTP_STATUS_CODES } from '../../../constants';

export const deleteCommentByIDHandler = async (
    req: RequestWithParams<URIParamsCommentIDModel>,
    res: Response,
    next: NextFunction
) => {
    try {
        const commentId = req.params.id;
        const userId = req.userId;

        await commentsService.deleteCommentById(commentId, userId as string);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
