import { postsService } from '../domain';
import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsPostIDModel } from '../models';

export const deletePostByIDHandler = async (req: Request<URIParamsPostIDModel>, res: Response, next: NextFunction) => {
    try {
        const postId = req.params.id;

        await postsService.deletePostById(postId);

        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
    } catch (err) {
        next(err);
    }
};
