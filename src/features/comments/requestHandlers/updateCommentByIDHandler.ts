import { NextFunction, Response } from 'express';
import { RequestWithParamsAndBody } from '../../shared/types';
import { URIParamsCommentIDModel, CreateUpdateCommentInputModel } from '../models';
import { commentsService } from '../domain';
import { HTTP_STATUS_CODES } from '../../../constants';

export const updateCommentByIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsCommentIDModel, CreateUpdateCommentInputModel>,
    res: Response,
    next: NextFunction
) => {
    try {
        const commentId = req.params.id;
        const payload = req.body;
        const userId = req.userId;

        await commentsService.updateCommentById(commentId, userId as string, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
