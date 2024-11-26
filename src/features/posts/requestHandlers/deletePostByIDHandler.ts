import { postsService } from '../domain';
import { Request, Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import type { URIParamsPostIDModel } from '../models';

export const deletePostByIDHandler = async (req: Request<URIParamsPostIDModel>, res: Response) => {
    const postId = req.params.id;

    const foundPost = await postsService.deletePostById(postId);

    if (!foundPost) {
        res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204);
};
