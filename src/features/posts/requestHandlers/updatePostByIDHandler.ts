import { postsService } from '../domain';
import { NextFunction, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { RequestWithParamsAndBody } from '../../shared/types';
import type { CreateUpdatePostInputModel, URIParamsPostIDModel } from '../models';

export const updatePostByIDHandler = async (
    req: RequestWithParamsAndBody<URIParamsPostIDModel, CreateUpdatePostInputModel>,
    res: Response,
    next: NextFunction
) => {
    try {
        const postId = req.params.id;
        const payload = req.body;

        await postsService.updatePost(postId, payload);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
